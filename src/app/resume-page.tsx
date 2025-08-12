
"use client";

import { useState, useEffect } from 'react';
import type { Resume } from '@/lib/types';
import type { AtsScoreResumeOutput } from '@/ai/flows/ats-score-resume';
import { initialResumeData } from '@/lib/resume-template';
import { getAtsScore } from '@/lib/actions';
import { ResumeBuilder } from '@/components/resume-builder';
import { ResumePreview } from '@/components/resume-preview';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/auth/user-nav';
import { Footer } from '@/components/footer';
import { sanitizeAndTrim } from '@/lib/utils';

const RESUME_STORAGE_KEY = 'firebase-studio-resume-data';

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<Resume>(() => {
    if (typeof window === 'undefined') {
      return initialResumeData;
    }
    try {
      const savedResume = window.localStorage.getItem(RESUME_STORAGE_KEY);
      return savedResume ? JSON.parse(savedResume) : initialResumeData;
    } catch (error) {
      console.error("Error loading resume from localStorage", error);
      return initialResumeData;
    }
  });
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState<AtsScoreResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
        } catch (error) {
            console.error("Error saving resume to localStorage", error);
        }
    }
  }, [resumeData]);

  const validateResume = (resume: Resume): string | null => {
    if (
      !resume.personalInfo.name ||
      !resume.personalInfo.email ||
      !resume.personalInfo.phone
    ) {
      return 'Please fill out your Name, Email, and Phone in Personal Information.';
    }
    if (!resume.summary) {
      return 'Please provide a Professional Summary.';
    }
    if (!resume.experience || resume.experience.length === 0 || !resume.experience[0].jobTitle) {
      return 'Please add at least one Work Experience entry.';
    }
     if (!resume.education || resume.education.length === 0 || !resume.education[0].school) {
      return 'Please add at least one Education entry.';
    }
    if (!resume.skills || resume.skills.length === 0) {
        return 'Please add at least one skill.';
    }
    return null;
  };


  const handleScoreFromBuilder = async () => {
    setIsLoading(true);
    setAtsResult(null);
    
    const validationError = validateResume(resumeData);
    if (validationError) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Resume',
        description: validationError,
      });
      setIsLoading(false);
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      toast({
        variant: 'destructive',
        title: 'Invalid Job Description',
        description: 'Please paste a complete job description (at least 50 characters) to get an accurate score.',
      });
      setIsLoading(false);
      return;
    }

    const resumeText = `
      Name: ${resumeData.personalInfo.name}
      Email: ${resumeData.personalInfo.email}
      Phone: ${resumeData.personalInfo.phone}
      Address: ${resumeData.personalInfo.address}
      LinkedIn: ${resumeData.personalInfo.linkedin}
      Portfolio: ${resumeData.personalInfo.portfolio}

      Summary:
      ${resumeData.summary}

      Experience:
      ${resumeData.experience
        .map(
          (exp) => `
        ${exp.jobTitle} at ${exp.company}, ${exp.location} (${exp.startDate} - ${exp.endDate})
        ${exp.description}
      `
        )
        .join('\n')}

      Education:
      ${resumeData.education
        .map(
          (edu) => `
        ${edu.degree} from ${edu.school}, ${edu.location} (Graduated: ${edu.graduationDate})
      `
        )
        .join('\n')}

      Projects:
      ${resumeData.projects
        ?.map(
          (proj) => `
        Project: ${proj.name}
        Description: ${proj.description}
        Link: ${proj.link}
      `
        )
        .join('\n')}

      Skills:
      ${resumeData.skills.join(', ')}

      Certifications:
      ${resumeData.certifications
        ?.map(
          (cert) => `
        ${cert.name} - ${cert.authority} (${cert.date}) - Link: ${cert.link || 'N/A'}
      `
        )
        .join('\n')}
      
      Awards:
      ${resumeData.awards
        ?.map(
          (award) => `
        ${award.name} - Link: ${award.link || 'N/A'}
      `
        )
        .join('\n')}
      
      Volunteer Experience:
      ${resumeData.volunteerExperience
        ?.map(
          (vol) => `
        ${vol.role} at ${vol.organization} (${vol.dates})
        ${vol.description}
      `
        )
        .join('\n')}
        
      Languages:
      ${resumeData.languages
        ?.map(
          (lang) => `
        ${lang.name} (${lang.proficiency})
      `
        )
        .join('\n')}
    `;

    const sanitizedResume = sanitizeAndTrim(resumeText, 15000);
    const sanitizedJobDescription = sanitizeAndTrim(jobDescription, 5000);

    const result = await getAtsScore(sanitizedResume, sanitizedJobDescription);

    if (result && 'error' in result) {
      console.error("ATS Scoring Error:", result.error);
      toast({
        variant: 'destructive',
        title: 'Error Scoring Resume',
        description: result.error,
      });
    } else if (result) {
      setAtsResult(result);
       toast({
        title: 'Analysis Complete!',
        description: 'Your resume has been successfully scored.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="relative isolate min-h-screen w-full bg-background">
      <div className="container mx-auto p-4 md:p-8 relative z-10">
        <header className="flex justify-between items-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-3">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-headline tracking-tight">HireByte</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
            </div>
        </header>

        <div className="text-center mb-8 md:mb-12">
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Build a professional, ATS-friendly resume with our guided editor. Then, score it against a job description to land your dream job.
            </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ResumeBuilder
            resumeData={resumeData}
            setResumeData={setResumeData}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            handleScore={handleScoreFromBuilder}
            isLoading={isLoading}
            atsResult={atsResult}
          />
          <div className="lg:sticky lg:top-8">
              <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </div>
       <Footer />
    </div>
  );
}
