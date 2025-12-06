"use client";

import { ArrowRight, CheckCircle, FileText, Zap, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface HeroSectionProps {
  onScrollToATS: () => void;
  onScrollToBuilder: () => void;
}

export function HeroSection({ onScrollToATS, onScrollToBuilder }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [resumesCreated, setResumesCreated] = useState(0);
  const [interviewRate, setInterviewRate] = useState(0);
  const { ref: statsRef, isIntersecting: statsVisible } = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Counter animation
  useEffect(() => {
    if (statsVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAtsScore(Math.floor(98 * progress));
        setResumesCreated(Math.floor(50 * progress));
        setInterviewRate(Math.floor(85 * progress));
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [statsVisible]);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered ATS Scoring",
      description: "Get instant feedback on how well your resume matches job requirements"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Build stunning resumes with our professionally designed templates"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Job-Targeted Optimization",
      description: "Optimize your resume for specific job descriptions and industries"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "HR-Approved Formats",
      description: "Templates created by HR professionals and hiring managers"
    }
  ];

  return (
    <section 
      className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-16 md:pt-20"
      itemScope 
      itemType="https://schema.org/WebApplication"
    >
      {/* Fixed Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <header className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className={`inline-flex items-center gap-3 mb-8 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20" role="img" aria-label="HireByte Logo">
                <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
              <h1 
                className="text-4xl sm:text-6xl lg:text-7xl font-bold font-headline tracking-tight"
                itemProp="name"
              >
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  HireByte
                </span>
              </h1>
            </div>
            
            <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Build Resumes That Get You
              <span className="text-primary block">Hired Faster</span>
            </h2>
            
            <p 
              className={`text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              itemProp="description"
            >
              Create professional, ATS-friendly resumes with our AI-powered platform. 
              Test your existing resume or build a new one from scratch with expert guidance.
            </p>
            
            {/* CTA Buttons */}
            <nav className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} aria-label="Main actions">
              <Button
                size="lg"
                onClick={onScrollToATS}
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200"
                aria-label="Test your existing resume for ATS compatibility"
              >
                Test My Resume
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onScrollToBuilder}
                className="text-lg px-8 py-6 border-2 hover:bg-primary/5 transform hover:scale-105 transition-all duration-200"
                aria-label="Create a new professional resume"
              >
                Build New Resume
                <FileText className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </nav>
          </header>
          
          {/* Features Grid */}
          <section 
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            aria-label="Key features of HireByte"
          >
            {features.map((feature, index) => (
              <article
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
                itemScope
                itemType="https://schema.org/SoftwareApplication"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
                    role="img"
                    aria-label={`${feature.title} icon`}
                  >
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2" itemProp="name">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" itemProp="description">{feature.description}</p>
              </article>
            ))}
          </section>
          
          {/* Stats */}
          <section 
            ref={statsRef} 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/20"
            aria-label="HireByte platform statistics"
          >
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2" aria-label="ATS compatibility rate">{atsScore}%</div>
              <div className="text-muted-foreground">ATS Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2" aria-label="Number of resumes created">{resumesCreated}K+</div>
              <div className="text-muted-foreground">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2" aria-label="Interview success rate">{interviewRate}%</div>
              <div className="text-muted-foreground">Interview Rate</div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}