
"use server";

import { atsScoreResume, type AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume";

export async function getAtsScore(
  resumeText: string,
  jobDescription: string
): Promise<AtsScoreResumeOutput | { error: string }> {
  if (!resumeText || !jobDescription) {
    return { error: "Resume and job description cannot be empty." };
  }
  
  if (jobDescription.length < 50) {
      return { error: "Job description is too short. Please provide a more detailed description." };
  }

  try {
    const result = await atsScoreResume({ resumeText, jobDescription });
    // It's possible for the AI to return a non-compliant or empty response
    if (!result || !result.score || !result.feedback) {
        console.error("ATS Scoring Error: AI returned invalid data", result);
        return { error: "The ATS service returned an invalid analysis. Please try adjusting your resume or job description." };
    }
    return result;
  } catch (e: any) {
    console.error("ATS Scoring Error in action:", e);
    // Check for specific error messages from Genkit or network issues
    if (e.message && e.message.includes('500')) {
        return { error: "The ATS analysis service is currently unavailable. Please try again later." };
    }
    if (e.message && e.message.includes('parse')) {
        return { error: "There was an issue processing the analysis from the ATS service. Please try again." };
    }
    return { error: "An unexpected error occurred while scoring the resume. Please try again later." };
  }
}
