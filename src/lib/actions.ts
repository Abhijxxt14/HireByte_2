"use server";

import { atsScoreResume, type AtsScoreResumeOutput } from "@/ai/flows/ats-score-resume";
import { suggestResumeText, type SuggestResumeTextInput, type SuggestResumeTextOutput } from "@/ai/flows/suggest-resume-text";
import { coachResume, type CoachResumeOutput } from "@/ai/flows/coach-resume";

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


export async function getResumeSuggestions(
  input: SuggestResumeTextInput
): Promise<SuggestResumeTextOutput | { error: string }> {
  try {
    const result = await suggestResumeText(input);
    return result;
  } catch (e) {
    console.error("Resume Suggestion Error:", e);
    return { error: "An unexpected error occurred while generating suggestions. Please try again later." };
  }
}

export async function getResumeCoaching(
    resumeText: string
): Promise<CoachResumeOutput | { error: string }> {
  if (!resumeText) {
    return { error: "Resume content cannot be empty." };
  }

  try {
    const result = await coachResume(resumeText);
    return result;
  } catch (e) {
    console.error("Resume Coaching Error:", e);
    return { error: "An unexpected error occurred while getting resume coaching. Please try again later." };
  }
}
