"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Resume } from "@/lib/types";
import { Download, Mail, Phone, Linkedin, Globe, MapPin } from "lucide-react";

interface ResumePreviewProps {
  resumeData: Resume;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <div id="resume-preview" className="bg-card text-card-foreground p-8 rounded-lg aspect-[8.5/11]">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{resumeData.personalInfo.name}</h1>
            <div className="flex justify-center items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {resumeData.personalInfo.address}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {resumeData.personalInfo.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {resumeData.personalInfo.phone}</span>
              {resumeData.personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="h-3 w-3" /> {resumeData.personalInfo.linkedin}</span>}
              {resumeData.personalInfo.portfolio && <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> {resumeData.personalInfo.portfolio}</span>}
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
                  <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>

          </main>
        </div>
        <div className="p-4 border-t no-print">
            <Button onClick={handlePrint} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
