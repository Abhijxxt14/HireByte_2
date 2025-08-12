
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


  const handleScoreFromBuilder = async () => {
    setIsLoading(true);
    setAtsResult(null);

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
        .map(
          (proj) => `
        Project: ${proj.name}
        Description: ${proj.description}
        Link: ${proj.link}
      `
        )
        .join('\n')}

      Skills:
      ${resumeData.skills.join(', ')}
    `;

    const result = await getAtsScore(resumeText, jobDescription);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      setAtsResult(result);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative isolate min-h-screen w-full bg-background">
      <div className="container mx-auto p-4 md:p-8 relative z-10">
        <header className="flex justify-between items-center mb-12">
            <div className="inline-flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              <h1 className="text-3xl sm:text-5xl font-bold font-headline tracking-tight">HireByte</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
            </div>
        </header>

        <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
          <div className="sticky top-8">
              <ResumePreview resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
