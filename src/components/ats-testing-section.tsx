"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAtsScore } from "@/lib/actions";
import type { AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume";
import { AtsScoreDisplay } from "@/components/ats-score-display";

interface ATSTestingSectionProps {
  onScrollToBuilder: () => void;
}

export function ATSTestingSection({ onScrollToBuilder }: ATSTestingSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsScoreResumeOutput | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.type.includes("document")) {
        setFile(droppedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or Word document."
        });
      }
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please upload a resume and provide a job description."
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll simulate the analysis since file parsing isn't implemented
      // In a real implementation, you'd extract text from the uploaded file
      const mockResumeData = {
        personalInfo: {
          name: "Sample User",
          email: "sample@email.com",
          phone: "123-456-7890",
          address: "City, State",
          linkedin: "",
          portfolio: "",
          github: ""
        },
        summary: "Sample resume summary extracted from uploaded file",
        experience: [],
        education: [],
        skills: ["Sample", "Skills"],
        projects: [],
        certifications: [],
        awards: [],
        volunteerExperience: [],
        languages: []
      };
      
      const result = await getAtsScore(mockResumeData, jobDescription);
      if ('error' in result) {
        throw new Error(result.error);
      }
      setAtsResult(result);
      
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been analyzed successfully."
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={ref}
      id="ats-testing" 
      className={`min-h-screen py-20 bg-gradient-to-br from-background to-muted/20 transition-all duration-1000 ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Test Your Resume's
              <span className="text-primary block">ATS Score</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your existing resume and get instant feedback on how well it matches 
              job requirements. Our AI analyzes your resume against ATS systems used by top companies.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* File Upload Section */}
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </CardTitle>
                <CardDescription>
                  Support for PDF and Word documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Description Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste the job description to match against
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="job-description">Job Requirements</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here. Include required skills, qualifications, and responsibilities..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!file || !jobDescription.trim() || isLoading}
              className="px-8 py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onScrollToBuilder}
              className="px-8 py-6 text-lg"
            >
              Build New Resume Instead
            </Button>
          </div>

          {/* Results Section */}
          {atsResult && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Here's how your resume performs against the job requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AtsScoreDisplay result={atsResult} />
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <div className="text-center mt-16 p-8 bg-muted/50 rounded-2xl">
            <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Need a Complete Makeover?</h3>
            <p className="text-muted-foreground mb-4">
              If your score is low, consider building a new resume from scratch with our guided builder.
            </p>
            <Button onClick={onScrollToBuilder} variant="outline">
              Try Resume Builder
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}