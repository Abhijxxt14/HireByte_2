"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateResumeText } from "@/lib/file-utils";
import { extractTextFromPDF } from "@/lib/pdf-extractor";
import { AtsScoreDisplay } from "@/components/ats-score-display";

interface ATSTestingSectionProps {
  onScrollToBuilder: () => void;
}

export function ATSTestingSection({ onScrollToBuilder }: ATSTestingSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<{score: number; feedback: string} | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [useTextInput, setUseTextInput] = useState(false);
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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsLoading(true);
      
      try {
        let extractedText = '';
        
        // Handle text files
        if (selectedFile.type === 'text/plain') {
          extractedText = await selectedFile.text();
        } 
        // Handle PDF files with client-side extraction
        else if (selectedFile.type === 'application/pdf') {
          toast({
            title: "Processing PDF",
            description: "Extracting text from your PDF file..."
          });
          extractedText = await extractTextFromPDF(selectedFile);
        } 
        // Handle other file types
        else {
          toast({
            variant: "destructive",
            title: "Unsupported file type",
            description: "Please upload a PDF or text file, or use the 'Paste Text' option."
          });
          setIsLoading(false);
          return;
        }
        
        if (extractedText && extractedText.length > 20) {
          setResumeText(extractedText);
          toast({
            title: "File processed!",
            description: `Extracted ${extractedText.length} characters from your resume.`
          });
        } else {
          toast({
            variant: "destructive",
            title: "No text found",
            description: "Could not extract text from the file. Please try the 'Paste Text' option."
          });
        }
      } catch (error) {
        console.error('File processing error:', error);
        toast({
          variant: "destructive",
          title: "Error processing file",
          description: "Could not read the file. Please try the 'Paste Text' option instead."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a job description."
      });
      return;
    }

    if (!file && !resumeText.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please upload a resume file or paste resume text."
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalResumeText = resumeText;
      
      // Validate resume text
      const validation = validateResumeText(finalResumeText);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Resume content needed",
          description: validation.error
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: finalResumeText.trim(),
          jobDescription: jobDescription.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      setAtsResult(result);
      
      toast({
        title: "Analysis Complete!",
        description: `Your resume scored ${result.score}/100 for this job.`
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
            {/* Resume Input Section */}
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Content
                </CardTitle>
                <CardDescription>
                  Upload a PDF/text file or paste your resume text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={!useTextInput ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseTextInput(false)}
                  >
                    Upload File
                  </Button>
                  <Button
                    variant={useTextInput ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseTextInput(true)}
                  >
                    Paste Text
                  </Button>
                </div>

                {!useTextInput ? (
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
                      accept=".pdf,.doc,.docx,.txt"
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
                          onClick={() => {
                            setFile(null);
                            setResumeText("");
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Drop your resume here</p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse files (PDF, DOC, TXT)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="resume-text">Resume Content</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setResumeText(`John Smith
Software Engineer
john.smith@email.com | (555) 123-4567 | linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Experienced Full-Stack Developer with 5+ years developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Led team of 4 developers to deliver projects 20% ahead of schedule.

EXPERIENCE
Senior Software Engineer | TechCorp Inc | 2022-Present
• Developed microservices architecture serving 100K+ daily users
• Reduced API response time by 40% through optimization
• Led migration to AWS cloud, cutting infrastructure costs by 30%

Software Engineer | StartupXYZ | 2020-2022
• Built responsive web applications using React and TypeScript
• Collaborated with cross-functional team of 8 members
• Implemented automated testing, reducing bugs by 25%

EDUCATION
Bachelor of Computer Science | State University | 2020

SKILLS
Programming: JavaScript, Python, Java, TypeScript
Frameworks: React, Node.js, Express, Next.js
Cloud: AWS, Docker, Kubernetes
Databases: PostgreSQL, MongoDB`)}
                        className="text-xs"
                      >
                        Use Sample Resume
                      </Button>
                    </div>
                    <Textarea
                      id="resume-text"
                      placeholder="Paste your resume content here. Include your experience, skills, education, and other relevant information..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {resumeText.length}/20000 characters
                    </p>
                  </div>
                )}
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="job-description">Job Requirements</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setJobDescription(`Senior Software Engineer - Full Stack

We are seeking a talented Senior Software Engineer to join our growing team. The ideal candidate will have 5+ years of experience in full-stack development and a passion for building scalable applications.

REQUIRED QUALIFICATIONS:
• 5+ years of software development experience
• Strong proficiency in JavaScript, TypeScript, and modern frameworks
• Experience with React, Node.js, and RESTful APIs
• Knowledge of cloud platforms (AWS, Azure, or GCP)
• Experience with databases (SQL and NoSQL)
• Familiarity with DevOps practices and CI/CD pipelines

PREFERRED QUALIFICATIONS:
• Bachelor's degree in Computer Science or related field
• Experience with microservices architecture
• Knowledge of containerization (Docker, Kubernetes)
• Experience leading technical projects
• Strong problem-solving and communication skills

RESPONSIBILITIES:
• Design and develop scalable web applications
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews and technical discussions
• Contribute to system architecture decisions`)}
                      className="text-xs"
                    >
                      Use Sample Job
                    </Button>
                  </div>
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
              disabled={(!file && !resumeText.trim()) || !jobDescription.trim() || isLoading}
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