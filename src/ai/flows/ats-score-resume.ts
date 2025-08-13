
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
  score: z.number().describe('The ATS score of the resume, out of 100. This should be a numerical value representing how well the resume matches the job description based on keywords, skills, and experience.'),
  feedback: z.string().describe('Actionable, specific feedback on how to improve the resume for ATS compatibility and better alignment with the job description. Provide bullet points for clarity.'),
});
export type AtsScoreResumeOutput = z.infer<typeof AtsScoreResumeOutputSchema>;

export async function atsScoreResume(input: AtsScoreResumeInput): Promise<AtsScoreResumeOutput> {
  return atsScoreResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsScoreResumePrompt',
  input: {schema: AtsScoreResumeInputSchema},
  output: {schema: AtsScoreResumeOutputSchema},
  prompt: `You are an expert in Applicant Tracking Systems (ATS) and a professional resume reviewer.

You will receive a resume and a job description. Your task is to:

1.  Analyze the resume and determine how well it matches the job description based on keywords, skills, experience, and overall fit.
2.  Provide a comprehensive ATS score out of 100. The score should reflect the quality of the match.
3.  Give specific, actionable feedback on how to improve the resume's compatibility with ATS systems and its alignment with this specific job description. The feedback should be constructive and easy to understand.

Resume Text:
{{{resumeText}}}

Job Description:
{{{jobDescription}}}
`,
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
