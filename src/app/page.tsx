
"use client";

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { SplashScreen } from '@/components/splash-screen';
import { HeroSection } from '@/components/hero-section';
import { ATSTestingSection } from '@/components/ats-testing-section';
import { ResumeBuilderSection } from '@/components/resume-builder-section';
import { AIResumeDialog } from '@/components/ai-resume-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const atsTestingRef = useRef<HTMLDivElement>(null);
  const resumeBuilderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show splash for 3 seconds then fade out (reduced from 5 seconds)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToATS = () => scrollToSection(atsTestingRef);
  const scrollToBuilder = () => scrollToSection(resumeBuilderRef);
  const scrollToTop = () => scrollToSection(heroRef);
  const openAIDialog = () => setShowComingSoon(true);

  if (showSplash) {
    return <SplashScreen />;
  }
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "HireByte",
    "description": "AI-powered resume builder and ATS compatibility checker that helps job seekers create optimized resumes",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://hirebyte.netlify.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI-Powered Resume Builder",
      "ATS Compatibility Checker", 
      "Resume Score Analysis",
      "Professional Resume Templates",
      "Real-time Optimization Suggestions"
    ],
    "provider": {
      "@type": "Organization",
      "name": "HireByte",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://hirebyte.netlify.app"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5"
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <main className="min-h-screen" itemScope itemType="https://schema.org/WebApplication">
        <div ref={heroRef}>
          <HeroSection 
            onScrollToATS={scrollToATS}
            onScrollToBuilder={scrollToBuilder}
            onOpenAIDialog={openAIDialog}
          />
        </div>
        
        <div ref={atsTestingRef} className="section-transition">
          <ATSTestingSection 
            onScrollToBuilder={scrollToBuilder}
          />
        </div>
        
        <div ref={resumeBuilderRef} className="section-transition">
          <ResumeBuilderSection 
            onBackToTop={scrollToTop}
          />
        </div>
      </main>
      
      <AIResumeDialog 
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
      />

      <AlertDialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <AlertDialogContent className="border-primary/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Coming Soon! 🚀</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-4">
              The AI Resume Creation feature is coming soon. We're working hard to bring you an amazing experience to create professional resumes through conversation with our AI assistant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction className="mt-4">Got it!</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
