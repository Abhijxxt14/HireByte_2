"use client";

import { useState, useEffect } from 'react';
import type { Resume } from '@/lib/types';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { getAtsScore } from '@/lib/actions';
import { ResumeBuilder } from '@/components/resume-builder';
import { ResumePreview } from '@/components/resume-preview';
import { useToast } from '@/hooks/use-toast';
import { FileText, ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import type { AtsScoreResumeOutput } from '@/ai/flows/ats-score-resume';
import { initialResumeData } from '@/lib/resume-template';

const RESUME_STORAGE_KEY = 'firebase-studio-resume-data';

interface ResumeBuilderSectionProps {
  onBackToTop: () => void;
}

export function ResumeBuilderSection({ onBackToTop }: ResumeBuilderSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
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

  const [isLoading, setIsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsScoreResumeOutput | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
    } catch (error) {
      console.error("Error saving resume to localStorage", error);
    }
  }, [resumeData]);

  const handleGetAtsScore = async (jobDesc: string) => {
    if (!jobDesc.trim()) {
      toast({
        variant: 'destructive',
        title: 'Job Description Required',
        description: 'Please provide a job description to analyze your resume.',
      });
      return;
    }

    setIsLoading(true);
    setJobDescription(jobDesc);
    
    try {
      const result = await getAtsScore(resumeData, jobDesc);
      if ('error' in result) {
        throw new Error(result.error);
      }
      setAtsResult(result);
      
      toast({
        title: 'Analysis Complete!',
        description: 'Your resume has been scored successfully.',
      });
    } catch (error) {
      console.error('Error getting ATS score:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={ref}
      id="resume-builder" 
      className={`min-h-screen py-20 bg-background transition-all duration-1000 ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container mx-auto p-4 md:p-8 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToTop}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Top
            </Button>
            <div className="inline-flex items-center gap-3">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-headline tracking-tight">Resume Builder</h1>
            </div>
          </div>

        </header>

        <div className="text-center mb-8 md:mb-12">
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Build a professional, ATS-friendly resume with our guided editor. Then, score it against a job description to land your dream job.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <ResumeBuilder 
              resumeData={resumeData}
              setResumeData={setResumeData}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              handleScore={() => handleGetAtsScore(jobDescription)}
              isLoading={isLoading}
              atsResult={atsResult}
            />
          </div>
          
          <div className="space-y-8">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>
        
        <Footer />
      </div>
    </section>
  );
}