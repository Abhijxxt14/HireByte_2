
"use client";

import type { Resume } from "@/lib/types";
import type { AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtsScoreDisplay } from "@/components/ats-score-display";
import { Bot, BrainCircuit, Loader2, PlusCircle, Trash2, User, GraduationCap, Briefcase, Wrench, Mic, MicOff, FolderKanban } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';

// SpeechRecognition API might not be available on all browsers
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

interface ResumeBuilderProps {
  resumeData: Resume;
  setResumeData: (data: Resume) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  handleScore: () => void;
  isLoading: boolean;
  atsResult: AtsScoreResumeOutput | null;
}

export function ResumeBuilder({
  resumeData,
  setResumeData,
  jobDescription,
  setJobDescription,
  handleScore,
  isLoading,
  atsResult,
}: ResumeBuilderProps) {
  const [isListening, setIsListening] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript && isListening) {
        const [field, indexStr] = isListening.split('-');
        const index = indexStr ? parseInt(indexStr) : -1;

        switch (field) {
          case 'summary':
            handleSummaryChange(resumeData.summary + finalTranscript);
            break;
          case 'experience':
            if (index !== -1) {
              const currentDesc = resumeData.experience[index].description;
              handleExperienceChange(index, "description", currentDesc + finalTranscript);
            }
            break;
          case 'project':
            if (index !== -1) {
              const currentDesc = resumeData.projects[index].description;
              handleProjectChange(index, "description", currentDesc + finalTranscript);
            }
            break;
          case 'skills':
             const currentSkills = resumeData.skills.join(", ");
             handleSkillsChange(currentSkills ? `${currentSkills}, ${finalTranscript}`: finalTranscript);
            break;
          case 'jobDescription':
            setJobDescription(jobDescription + finalTranscript);
            break;
        }
      }
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start(); // Keep listening if it was not manually stopped
        }
    };

    recognitionRef.current = recognition;

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, [isListening, resumeData, jobDescription]);

  const toggleListening = (field: string) => {
    if (isListening === field) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(null);
    } else {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(field);
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, [field]: value } });
  };
  
  const handleSummaryChange = (value: string) => {
    setResumeData({ ...resumeData, summary: value });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: crypto.randomUUID(),
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setResumeData({ ...resumeData, education: newEducation });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { id: crypto.randomUUID(), school: "", degree: "", location: "", graduationDate: "" },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: newEducation });
  };

  const handleSkillsChange = (value: string) => {
    setResumeData({ ...resumeData, skills: value.split(",").map((s) => s.trim()) });
  };
  
  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...resumeData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setResumeData({ ...resumeData, projects: newProjects });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { id: crypto.randomUUID(), name: "", description: "", link: "" },
      ],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: newProjects });
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="font-headline">Resume Builder</CardTitle>
            <CardDescription>Fill out the sections below to create your resume.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="personal-info">
          <AccordionItem value="personal-info">
            <AccordionTrigger className="font-semibold"><User className="mr-2"/>Personal Information</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={resumeData.personalInfo.name} onChange={(e) => handlePersonalInfoChange("name", e.target.value)} /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handlePersonalInfoChange("email", e.target.value)} /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={resumeData.personalInfo.phone} onChange={(e) => handlePersonalInfoChange("phone", e.target.value)} /></div>
                <div><Label htmlFor="address">Address</Label><Input id="address" value={resumeData.personalInfo.address} onChange={(e) => handlePersonalInfoChange("address", e.target.value)} /></div>
                <div><Label htmlFor="linkedin">LinkedIn Profile</Label><Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)} /></div>
                <div><Label htmlFor="portfolio">Portfolio/Website</Label><Input id="portfolio" value={resumeData.personalInfo.portfolio} onChange={(e) => handlePersonalInfoChange("portfolio", e.target.value)} /></div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="summary">
            <AccordionTrigger className="font-semibold"><Briefcase className="mr-2"/>Professional Summary</AccordionTrigger>
            <AccordionContent className="space-y-2 p-1">
                <div className="relative">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea id="summary" value={resumeData.summary} onChange={(e) => handleSummaryChange(e.target.value)} placeholder="Write a brief professional summary..." rows={4} className="pr-10"/>
                    {SpeechRecognition && (
                        <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground" onClick={() => toggleListening('summary')}>
                            {isListening === 'summary' ? <MicOff className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger className="font-semibold"><Briefcase className="mr-2"/>Work Experience</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Job Title</Label><Input value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)} /></div>
                    <div><Label>Company</Label><Input value={exp.company} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} /></div>
                    <div><Label>Location</Label><Input value={exp.location} onChange={(e) => handleExperienceChange(index, "location", e.target.value)} /></div>
                    <div><Label>Start Date</Label><Input value={exp.startDate} onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)} /></div>
                    <div><Label>End Date</Label><Input value={exp.endDate} onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)} /></div>
                  </div>
                  <div className="relative">
                    <Label>Description</Label>
                    <Textarea value={exp.description} onChange={(e) => handleExperienceChange(index, "description", e.target.value)} rows={3} placeholder="- Key achievement 1..." className="pr-10"/>
                    {SpeechRecognition && (
                         <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground" onClick={() => toggleListening(`experience-${index}`)}>
                            {isListening === `experience-${index}` ? <MicOff className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addExperience}><PlusCircle className="mr-2"/>Add Experience</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education">
            <AccordionTrigger className="font-semibold"><GraduationCap className="mr-2"/>Education</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>School/University</Label><Input value={edu.school} onChange={(e) => handleEducationChange(index, "school", e.target.value)} /></div>
                    <div><Label>Degree & Major</Label><Input value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} /></div>
                    <div><Label>Location</Label><Input value={edu.location} onChange={(e) => handleEducationChange(index, "location", e.target.value)} /></div>
                    <div><Label>Graduation Date</Label><Input value={edu.graduationDate} onChange={(e) => handleEducationChange(index, "graduationDate", e.target.value)} /></div>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addEducation}><PlusCircle className="mr-2"/>Add Education</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="projects">
            <AccordionTrigger className="font-semibold"><FolderKanban className="mr-2"/>Projects</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {resumeData.projects.map((proj, index) => (
                <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative">
                  <div><Label>Project Name</Label><Input value={proj.name} onChange={(e) => handleProjectChange(index, "name", e.target.value)} /></div>
                  <div className="relative">
                    <Label>Description</Label>
                    <Textarea value={proj.description} onChange={(e) => handleProjectChange(index, "description", e.target.value)} rows={3} placeholder="Describe your project..." className="pr-10" />
                    {SpeechRecognition && (
                        <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground" onClick={() => toggleListening(`project-${index}`)}>
                            {isListening === `project-${index}` ? <MicOff className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                  </div>
                  <div><Label>Demo Link</Label><Input value={proj.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} /></div>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addProject}><PlusCircle className="mr-2"/>Add Project</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills">
            <AccordionTrigger className="font-semibold"><Wrench className="mr-2"/>Skills</AccordionTrigger>
            <AccordionContent className="p-1">
                <div className="relative">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Textarea id="skills" value={resumeData.skills.join(", ")} onChange={(e) => handleSkillsChange(e.target.value)} className="pr-10"/>
                    {SpeechRecognition && (
                        <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground" onClick={() => toggleListening('skills')}>
                            {isListening === 'skills' ? <MicOff className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ats-score">
            <AccordionTrigger className="font-semibold"><BrainCircuit className="mr-2"/>ATS Score</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              <div className="relative">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea id="job-description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={6} className="pr-10"/>
                 {SpeechRecognition && (
                    <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground" onClick={() => toggleListening('jobDescription')}>
                        {isListening === 'jobDescription' ? <MicOff className="h-4 w-4 text-primary" /> : <Mic className="h-4 w-4" />}
                    </Button>
                )}
              </div>
              <Button onClick={handleScore} disabled={isLoading} className="w-full bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent)/0.9)]">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Analyzing..." : "Analyze and Score"}
              </Button>
              {isLoading && <p className="text-center text-sm text-muted-foreground">AI is analyzing your resume. This may take a moment...</p>}
              {atsResult && <AtsScoreDisplay result={atsResult} />}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
