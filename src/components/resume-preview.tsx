"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Resume } from "@/lib/types";
import { Download, Mail, Phone, Linkedin, Globe, MapPin, ExternalLink } from "lucide-react";

interface ResumePreviewProps {
  resumeData: Resume;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const ensureUrlScheme = (url: string) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  return (
    <Card className="shadow-2xl shadow-primary/10 transition-shadow duration-300 hover:shadow-primary/20">
      <CardContent className="p-0">
        <div id="resume-preview" className="bg-card text-card-foreground p-8 rounded-lg aspect-[8.5/11]">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{resumeData.personalInfo.name}</h1>
            <div className="flex justify-center items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {resumeData.personalInfo.address}</span>
              <a href={`mailto:${resumeData.personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors"><Mail className="h-3 w-3" /> {resumeData.personalInfo.email}</a>
              <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {resumeData.personalInfo.phone}</span>
              {resumeData.personalInfo.linkedin && <a href={ensureUrlScheme(resumeData.personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Linkedin className="h-3 w-3" /> {resumeData.personalInfo.linkedin}</a>}
              {resumeData.personalInfo.portfolio && <a href={ensureUrlScheme(resumeData.personalInfo.portfolio)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe className="h-3 w-3" /> {resumeData.personalInfo.portfolio}</a>}
            </div>
          </header>

          <main className="space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Summary</h2>
              <p className="text-sm">{resumeData.summary}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Experience</h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="text-sm">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold">{exp.jobTitle}</h3>
                      <span className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-muted-foreground">
                       <p className="italic">{exp.company}</p>
                       <p className="italic text-xs">{exp.location}</p>
                    </div>
                    <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground/90 whitespace-pre-wrap">
                      {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Projects</h2>
              <div className="space-y-4">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="text-sm">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold">{proj.name}</h3>
                      {proj.link && (
                         <a href={ensureUrlScheme(proj.link)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors">
                            Live Demo <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground/90">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Education</h2>
              <div className="space-y-2">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold">{edu.school}</h3>
                      <span className="text-xs text-muted-foreground">{edu.graduationDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-muted-foreground">
                      <p className="italic">{edu.degree}</p>
                      <p className="italic text-xs">{edu.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 border-b-2 border-primary pb-1">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-primary/20">{skill}</span>
                ))}
              </div>
            </div>

          </main>
        </div>
        <div className="p-4 border-t no-print">
            <Button onClick={handlePrint} className="w-full transition-transform hover:scale-105 active:scale-100">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}