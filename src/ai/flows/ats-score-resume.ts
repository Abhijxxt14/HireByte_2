'use server';

/**
 * @fileOverview An ATS (Applicant Tracking System) scoring AI agent.
 *
 * - atsScoreResume - A function that handles the ATS scoring process.
 * - AtsScoreResumeInput - The input type for the atsScoreResume function.
 * - AtsScoreResumeOutput - The return type for the atsScoreResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsScoreResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be scored.'),
  jobDescription: z.string().describe('The job description to match the resume against.'),
});
export type AtsScoreResumeInput = z.infer<typeof AtsScoreResumeInputSchema>;

const AtsScoreResumeOutputSchema = z.object({
  score: z.number().describe('The ATS score of the resume, out of 100.'),
  feedback: z.string().describe('Feedback on how to improve the resume for ATS compatibility.'),
});
export type AtsScoreResumeOutput = z.infer<typeof AtsScoreResumeOutputSchema>;

export async function atsScoreResume(input: AtsScoreResumeInput): Promise<AtsScoreResumeOutput> {
  return atsScoreResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsScoreResumePrompt',
  input: {schema: AtsScoreResumeInputSchema},
  output: {schema: AtsScoreResumeOutputSchema},
  prompt: `You are an expert in Applicant Tracking Systems (ATS) and resume optimization.

You will receive a resume and a job description. Your task is to:

1.  Analyze the resume and determine how well it matches the job description.
2.  Provide an ATS score out of 100.
3.  Give actionable feedback on how to improve the resume's compatibility with ATS systems, specifically tailored to the job description.

Resume:
{{resumeText}}

Job Description:
{{jobDescription}}

Score (out of 100):`,
});

const atsScoreResumeFlow = ai.defineFlow(
  {
    name: 'atsScoreResumeFlow',
    inputSchema: AtsScoreResumeInputSchema,
    outputSchema: AtsScoreResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
