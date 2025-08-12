
"use server";

import type { Resume } from "@/lib/types";
import { scoreResumeWithKeywords, type KeywordAtsResult } from "./ats-keyword-scorer";
import { sanitizeAndTrim } from "./utils";

export async function getAtsScore(
  resume: Resume,
  jobDescription: string
): Promise<KeywordAtsResult | { error: string }> {
  // Basic validation
  if (!jobDescription || jobDescription.trim().length < 50) {
    return {
      error: 'Please provide a complete job description (at least 50 characters).',
    };
  }
  if (!resume.skills || resume.skills.length === 0) {
    return { error: 'Please add skills to your resume.' };
  }
  if (!resume.experience || resume.experience.length === 0) {
    return { error: 'Please add work experience to your resume.' };
  }
  if (!resume.summary) {
    return { error: 'Please add a professional summary to your resume.' }
  }


  // Construct searchable resume text blocks
  const skillsText = resume.skills.join(' ');
  const experienceText = resume.experience
    .map(e => `${e.jobTitle} ${e.description}`)
    .join(' ');
  
  const otherText = [
    resume.summary,
    resume.personalInfo.name,
    ...resume.education.map(e => `${e.degree} ${e.school}`),
    ...(resume.projects?.map(p => `${p.name} ${p.description}`) || []),
  ].join(' ');

  const resumeTextSections = {
    skills: sanitizeAndTrim(skillsText, 10000),
    experience: sanitizeAndTrim(experienceText, 20000),
    other: sanitizeAndTrim(otherText, 10000),
  };
  
  const sanitizedJobDescription = sanitizeAndTrim(jobDescription, 20000);

  try {
    const result = scoreResumeWithKeywords(resumeTextSections, sanitizedJobDescription);
    if ('error' in result) {
        console.error("Keyword Scoring Error in action:", result.error);
        return { error: "Could not process the resume or job description text. Please check the content and try again." };
    }
    return result;
  } catch (e: any) {
    console.error("Critical Error in getAtsScore action:", e);
    return { error: "An unexpected server error occurred while scoring the resume. Please try again later." };
  }
}
