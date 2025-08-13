
"use server";

import type { Resume } from "@/lib/types";
import { sanitizeAndTrim } from "./utils";
import { atsScoreResume, type AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume";
import { extractTextFromResume } from "./resume-text-extractor";

export async function getAtsScore(
  resume: Resume,
  jobDescription: string
): Promise<AtsScoreResumeOutput | { error: string }> {
  // Basic validation
  if (!jobDescription || jobDescription.trim().length < 3) {
    return {
      error: 'Please provide at least a few words for the job description.',
    };
  }
  
  const resumeText = extractTextFromResume(resume);

  if (!resumeText || resumeText.trim().length < 50) {
      return { error: 'Your resume seems to be missing key information. Please fill out the summary, experience, and skills sections.' };
  }

  const sanitizedJobDescription = sanitizeAndTrim(jobDescription, 15000);
  const sanitizedResumeText = sanitizeAndTrim(resumeText, 20000);
  
  try {
    const result = await atsScoreResume({
      resumeText: sanitizedResumeText,
      jobDescription: sanitizedJobDescription,
    });
    return result;
  } catch (e: any) {
    console.error("Critical Error in getAtsScore action:", e);
    // Check for specific Genkit/AI-related error messages
    if (e.message && (e.message.includes('API key') || e.message.includes('permission denied'))) {
        return { error: "Could not connect to the AI service. Please check the API key." };
    }
    if (e.message && e.message.includes('503')) {
        return { error: "The AI service is currently unavailable. Please try again later."};
    }
    return { error: "An unexpected error occurred while analyzing the resume. The AI model may be temporarily unavailable." };
  }
}
