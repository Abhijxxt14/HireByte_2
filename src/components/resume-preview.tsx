
"use client";

import { Button } from "@/components/ui/button";
import type { Resume } from "@/lib/types";
import { Download, Mail, Phone, Linkedin, Globe, MapPin, ExternalLink, Link as LinkIcon, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumeDownloadButton } from "@/components/resume-download-button";

interface ResumePreviewProps {
  resumeData: Resume;
  sectionOrder?: string[];
}

export function ResumePreview({ resumeData, sectionOrder }: ResumePreviewProps) {
  // Default section order if not provided
  const defaultSectionOrder = [
    'summary',
    'experience',
    'projects',
    'education',
    'skills',
    'certifications',
    'awards',
    'volunteer',
    'languages'
  ];
  
  const sections = sectionOrder?.filter(s => s !== 'personal-info' && s !== 'job-description') || defaultSectionOrder;
  const handlePrint = async () => {
    try {
      // Show loading state
      const button = document.querySelector('.download-pdf-btn') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating PDF...';
      }

      // Dynamically import jsPDF to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate total content sections to adjust spacing dynamically
      const sectionCount = [
        resumeData.summary,
        resumeData.experience?.length,
        resumeData.education?.length,
        resumeData.projects?.length,
        resumeData.skills?.length,
        resumeData.certifications?.length,
      ].filter(Boolean).length;

      // Dynamic spacing based on content density
      const baseSpacing = sectionCount > 4 ? 5 : 7; // Tighter spacing if more sections
      const sectionGap = sectionCount > 4 ? 6 : 8;
      
      let yPos = 15;
      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);

      // Helper function to add clickable link
      const addLink = (text: string, url: string, x: number, y: number, fontSize = 9) => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 86, 193); // Blue color for links
        const textWidth = pdf.getTextWidth(text);
        (pdf as any).textWithLink(text, x, y, { url: url });
        pdf.setTextColor(0, 0, 0); // Reset to black
        return textWidth;
      };

      // Name - Centered and Bold (larger if less content)
      const nameFontSize = sectionCount < 3 ? 24 : 20;
      pdf.setFontSize(nameFontSize);
      pdf.setFont('helvetica', 'bold');
      const name = resumeData.personalInfo.name || 'Your Name';
      const nameWidth = pdf.getTextWidth(name);
      pdf.text(name, (pageWidth - nameWidth) / 2, yPos);
      yPos += sectionCount < 3 ? 8 : 7;

      // Contact Info - Centered
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const contactInfo = [];
      if (resumeData.personalInfo.address) contactInfo.push(resumeData.personalInfo.address);
      if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
      if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
      
      if (contactInfo.length > 0) {
        const contactLine = contactInfo.join(' | ');
        const contactWidth = pdf.getTextWidth(contactLine);
        pdf.text(contactLine, (pageWidth - contactWidth) / 2, yPos);
        yPos += 5;
      }

      // Links - Centered
      const links = [];
      if (resumeData.personalInfo.linkedin) links.push({ text: 'LinkedIn', url: resumeData.personalInfo.linkedin });
      if (resumeData.personalInfo.github) links.push({ text: 'GitHub', url: resumeData.personalInfo.github });
      if (resumeData.personalInfo.portfolio) links.push({ text: 'Portfolio', url: resumeData.personalInfo.portfolio });
      
      if (links.length > 0) {
        const linksText = links.map(l => l.text).join(' | ');
        const linksWidth = pdf.getTextWidth(linksText);
        let linkX = (pageWidth - linksWidth) / 2;
        
        links.forEach((link, index) => {
          if (index > 0) {
            pdf.text(' | ', linkX, yPos);
            linkX += pdf.getTextWidth(' | ');
          }
          const textWidth = addLink(link.text, link.url.startsWith('http') ? link.url : `https://${link.url}`, linkX, yPos);
          linkX += textWidth;
        });
        yPos += 7;
      } else {
        yPos += 2;
      }

      // Summary
      if (resumeData.summary) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL SUMMARY', margin, yPos);
        yPos += baseSpacing;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
        summaryLines.forEach((line: string) => {
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += sectionGap;
      }

      // Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('WORK EXPERIENCE', margin, yPos);
        yPos += baseSpacing;

        const expCount = resumeData.experience.length;
        const bulletLimit = expCount > 2 ? 2 : 3; // Show fewer bullets if more experiences

        resumeData.experience.forEach((exp, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(exp.jobTitle || '', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
          const dateWidth = pdf.getTextWidth(dateText);
          pdf.text(dateText, pageWidth - margin - dateWidth, yPos);
          yPos += 5;

          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text(exp.company || '', margin, yPos);
          if (exp.location) {
            const locWidth = pdf.getTextWidth(exp.location);
            pdf.text(exp.location, pageWidth - margin - locWidth, yPos);
          }
          yPos += 5;

          pdf.setFont('helvetica', 'normal');
          if (exp.description) {
            const bullets = exp.description.split('\n').filter(line => line.trim());
            bullets.slice(0, bulletLimit).forEach((bullet) => {
              const cleanBullet = bullet.replace(/^- /, '');
              const bulletLines = pdf.splitTextToSize(`• ${cleanBullet}`, contentWidth - 3);
              bulletLines.forEach((line: string) => {
                if (yPos > 280) {
                  pdf.addPage();
                  yPos = 15;
                }
                pdf.text(line, margin + 3, yPos);
                yPos += 5;
              });
            });
          }
          yPos += index < expCount - 1 ? 5 : sectionGap;
        });
      }

      // Education
      if (resumeData.education && resumeData.education.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EDUCATION', margin, yPos);
        yPos += baseSpacing;

        resumeData.education.forEach((edu, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 15;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(edu.degree || '', margin, yPos);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          const dateWidth = pdf.getTextWidth(edu.graduationDate || '');
          pdf.text(edu.graduationDate || '', pageWidth - margin - dateWidth, yPos);
          yPos += 5;

          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text(edu.school || '', margin, yPos);
          if (edu.location) {
            const locWidth = pdf.getTextWidth(edu.location);
            pdf.text(edu.location, pageWidth - margin - locWidth, yPos);
          }
          yPos += index < resumeData.education.length - 1 ? 6 : sectionGap;
        });
      }

      // Skills
      if (resumeData.skills && resumeData.skills.length > 0) {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 15;
        }
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SKILLS', margin, yPos);
        yPos += baseSpacing;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const skillsText = resumeData.skills.filter(s => s).join(', ');
        const skillsLines = pdf.splitTextToSize(skillsText, contentWidth);
        skillsLines.forEach((line: string) => {
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += sectionGap;
      }

      // Download the PDF
      const fileName = `${resumeData.personalInfo.name || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);

      // Reset button
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      const button = document.querySelector('.download-pdf-btn') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Download PDF';
      }
    }
  };

  const ensureUrlScheme = (url: string) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  const renderSection = (title: string, data: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
    if (!data || data.length === 0) return null;
    return (
      <section className="mb-1.5 print:mb-1 print:page-break-inside-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">{title}</h2>
        <div className="space-y-1 print:space-y-0.5">
          {data.map(renderItem)}
        </div>
      </section>
    );
  };
  
  const renderSimpleListSection = (title: string, data: any[] | undefined, renderItem: (item: any, index: number) => React.ReactNode) => {
     if (!data || data.length === 0) return null;
      return (
        <section className="mb-1.5 print:mb-1 print:page-break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">{title}</h2>
          <ul className="list-disc list-inside mt-0 text-xs text-muted-foreground/90 print:text-xs print:mt-0">
            {data.map(renderItem)}
          </ul>
        </section>
      );
  }

  // Function to render each section based on section ID
  const renderSectionById = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return resumeData.summary ? (
          <section key="summary" className="mb-1.5 print:mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">Summary</h2>
            <p className="text-muted-foreground/90 text-xs leading-tight print:leading-tight print:text-xs">{resumeData.summary}</p>
          </section>
        ) : null;
      
      case 'experience':
        return renderSection("Experience", resumeData.experience, (exp) => (
          <div key={exp.id} className="print:page-break-inside-avoid">
            <div className="flex justify-between items-baseline gap-1">
              <h3 className="font-bold text-xs">{exp.jobTitle}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-muted-foreground text-xs gap-1">
                <p className="italic">{exp.company}</p>
                <p className="italic text-xs whitespace-nowrap">{exp.location}</p>
            </div>
            <ul className="list-disc list-inside mt-0.5 text-muted-foreground/90 text-xs leading-tight print:text-black">
              {exp.description.split('\n').slice(0, 2).map((line: string, i: number) => line && <li key={i} className="text-xs">{line.replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ));
      
      case 'projects':
        return renderSection("Projects", resumeData.projects, (proj) => (
           <div key={proj.id} className="print:page-break-inside-avoid">
            <div className="flex justify-between items-baseline gap-1">
              <h3 className="font-bold text-xs">{proj.name}</h3>
              {proj.link && (
                  <a href={ensureUrlScheme(proj.link)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5 transition-colors whitespace-nowrap">
                    View <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
            <p className="mt-0 text-muted-foreground/90 text-xs">{proj.description}</p>
          </div>
        ));
      
      case 'education':
        return renderSection("Education", resumeData.education, (edu) => (
          <div key={edu.id} className="print:page-break-inside-avoid">
            <div className="flex justify-between items-baseline gap-1">
              <h3 className="font-bold text-xs">{edu.school}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{edu.graduationDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-muted-foreground text-xs gap-1">
              <div>
                <p className="italic text-xs">{edu.degree}</p>
                {edu.grade && (
                  <p className="text-xs mt-0">
                    <span className="font-medium">Grade:</span> {edu.grade}
                  </p>
                )}
              </div>
              <p className="italic text-xs whitespace-nowrap">{edu.location}</p>
            </div>
          </div>
        ));
      
      case 'certifications':
        return renderSection("Certifications", resumeData.certifications, (cert) => (
            <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                       <h3 className="font-semibold">{cert.name}</h3>
                        {cert.link && (
                            <a href={ensureUrlScheme(cert.link)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 transition-colors">
                                <LinkIcon className="h-3 w-3" /> View
                            </a>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">{cert.date}</span>
                </div>
                <p className="italic text-muted-foreground">{cert.authority}</p>
            </div>
        ));
      
      case 'awards':
        return renderSimpleListSection("Awards & Achievements", resumeData.awards, (award) => (
             <li key={award.id} className="flex items-center gap-2">
                <span>{award.name}</span>
                {award.link && (
                    <a href={ensureUrlScheme(award.link)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 transition-colors">
                        <LinkIcon className="h-3 w-3" /> View
                    </a>
                )}
            </li>
        ));
      
      case 'volunteer':
        return renderSection("Volunteer Experience", resumeData.volunteerExperience, (vol) => (
            <div key={vol.id}>
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{vol.role}</h3>
                    <span className="text-xs text-muted-foreground">{vol.dates}</span>
                </div>
                <p className="italic text-muted-foreground">{vol.organization}</p>
                <p className="mt-1 text-muted-foreground/90">{vol.description}</p>
            </div>
        ));
      
      case 'skills':
        return resumeData.skills && resumeData.skills.length > 0 ? (
            <section key="skills" className="mb-4 md:mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2 screen-skills-display">
                {resumeData.skills.map((skill) => (
                skill && <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-primary/20">{skill}</span>
                ))}
            </div>
            <div className="hidden print-skills-display">
                <p className="text-muted-foreground/90">
                    {resumeData.skills.join(", ")}
                </p>
            </div>
            </section>
        ) : null;
      
      case 'languages':
        return resumeData.languages && resumeData.languages.length > 0 ? (
            <section key="languages" className="mb-4 md:mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Languages</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
                {resumeData.languages.map((lang) => (
                lang.name && <div key={lang.id}><span className="font-semibold">{lang.name}:</span> <span className="text-muted-foreground">{lang.proficiency}</span></div>
                ))}
            </div>
            </section>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <>
      <div id="resume-preview" className="bg-card text-card-foreground p-2 md:p-3 rounded-lg print:p-0 print:m-0 print:rounded-none print:bg-white print:text-black print:shadow-none md:aspect-[8.5/11] md:shadow-2xl md:shadow-primary/10 md:transition-shadow md:duration-300 md:hover:shadow-primary/20">
          <header className="text-center mb-1 print:mb-1">
            <h1 className="text-base md:text-lg font-bold font-headline tracking-tight print:text-base print:mb-0">{resumeData.personalInfo.name}</h1>
            <div className="flex justify-center items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground mt-0 flex-wrap print:gap-x-1 print:text-xs print:mt-0">"
              {resumeData.personalInfo.address && <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {resumeData.personalInfo.address}</span>}
              {resumeData.personalInfo.email && <a href={`mailto:${resumeData.personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors break-all"><Mail className="h-3 w-3" /> {resumeData.personalInfo.email}</a>}
              {resumeData.personalInfo.phone && <a href={`tel:${resumeData.personalInfo.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors"><Phone className="h-3 w-3" /> {resumeData.personalInfo.phone}</a>}
              {resumeData.personalInfo.linkedin && <a href={ensureUrlScheme(resumeData.personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Linkedin className="h-3 w-3" /> LinkedIn</a>}
              {resumeData.personalInfo.github && <a href={ensureUrlScheme(resumeData.personalInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Github className="h-3 w-3" /> GitHub</a>}
              {resumeData.personalInfo.portfolio && <a href={ensureUrlScheme(resumeData.personalInfo.portfolio)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe className="h-3 w-3" /> Portfolio</a>}
            </div>
          </header>

          <main className="text-xs print:text-xs leading-tight print:leading-tight">
            {sections.map(sectionId => renderSectionById(sectionId))}

          </main>
        </div>
        <div className="p-4 border-t no-print flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex-1 transition-transform hover:scale-105 active:scale-100 download-pdf-btn">
            <Download className="mr-2 h-4 w-4" />
            Legacy PDF
            </Button>
            <div className="flex-1">
              <ResumeDownloadButton resumeData={resumeData} />
            </div>
        </div>
      </>
    );
}