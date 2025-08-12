'use server';

/**
 * @fileOverview An AI agent that acts as a resume coach.
 *
 * - coachResume - A function that analyzes a resume and provides actionable feedback.
 * - CoachResumeInput - The input type for the coachResume function.
 * - CoachResumeOutput - The return type for the coachResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoachResumeInputSchema = z.string().describe('The full text content of the resume to be coached.');
export type CoachResumeInput = z.infer<typeof CoachResumeInputSchema>;

const SuggestionSchema = z.object({
  original_text: z.string().describe("The exact text from the resume that the suggestion applies to."),
  suggestion: z.string().describe("The improvement suggestion for the original text."),
});

const CoachResumeOutputSchema = z.array(SuggestionSchema);
export type CoachResumeOutput = z.infer<typeof CoachResumeOutputSchema>;


export async function coachResume(input: CoachResumeInput): Promise<CoachResumeOutput> {
  return coachResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coachResumePrompt',
  input: {schema: z.string()},
  output: {
    schema: CoachResumeOutputSchema,
    format: 'json'
  },
  prompt: `You are an expert resume coach and recruiter.
Your task is to analyze the provided resume text and return specific, actionable suggestions for improvement without rewriting the entire resume.

Guidelines:
1. Do not change the structure or formatting of the resume.
2. Identify weak or vague statements and suggest improvements.
3. Suggest stronger action verbs where appropriate.
4. Recommend quantifiable results when possible (e.g., “increased sales by 30%” instead of “improved sales”).
5. Flag redundant or irrelevant details.
6. Suggest missing skills or keywords relevant to the target role if applicable.
7. Keep tone professional and positive.
8. Return results in JSON format for easy display in the UI.

Resume Text:
{{{prompt}}}
`,
});

const coachResumeFlow = ai.defineFlow(
  {
    name: 'coachResumeFlow',
    inputSchema: CoachResumeInputSchema,
    outputSchema: CoachResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || [];
  }
);
