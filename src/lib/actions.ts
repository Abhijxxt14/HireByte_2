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
    return result;
  } catch (e) {
    console.error("ATS Scoring Error:", e);
    return { error: "An unexpected error occurred while scoring the resume. Please try again later." };
  }
}
