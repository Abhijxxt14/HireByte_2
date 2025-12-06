
"use client";

import { useState, useEffect } from 'react';
import type { Resume } from '@/lib/types';
import { getAtsScore } from '@/lib/actions';
import { ResumeBuilder } from '@/components/resume-builder';
import { ResumePreview } from '@/components/resume-preview';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';
import type { AtsScoreResumeOutput } from '@/ai/flows/ats-score-resume';
import { initialResumeData } from '@/lib/resume-template';


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

    if (!jobDescription || jobDescription.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Invalid Job Description',
        description: 'Please provide at least a few words for the job description.',
      });
      setIsLoading(false);
      return;
    }

    const result = await getAtsScore(resumeData, jobDescription);

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
        description: 'Your resume has been successfully scored by our AI coach.',
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
