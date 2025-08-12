'use server';

/**
 * @fileOverview An AI agent for generating resume text suggestions.
 *
 * - suggestResumeText - A function that handles the text suggestion process.
 * - SuggestResumeTextInput - The input type for the suggestResumeText function.
 * - SuggestResumeTextOutput - The return type for the suggestResumeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResumeTextInputSchema = z.object({
  section: z.string().describe('The resume section for which to generate suggestions (e.g., "Summary", "Experience Description").'),
  currentText: z.string().describe('The current text written by the user.').optional(),
  context: z.record(z.string()).describe('Additional context for the suggestion, like job title or company.').optional(),
});
export type SuggestResumeTextInput = z.infer<typeof SuggestResumeTextInputSchema>;

const SuggestResumeTextOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of 3-5 improved text suggestions.'),
});
export type SuggestResumeTextOutput = z.infer<typeof SuggestResumeTextOutputSchema>;

export async function suggestResumeText(input: SuggestResumeTextInput): Promise<SuggestResumeTextOutput> {
  return suggestResumeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeTextPrompt',
  input: {schema: SuggestResumeTextInputSchema},
  output: {schema: SuggestResumeTextOutputSchema},
  prompt: `You are a professional resume writing assistant. Your task is to generate 3 to 5 improved text suggestions for a specific section of a user's resume.

Resume Section: {{section}}
{{#if context}}
Context:
{{#each context}}
- {{@key}}: {{this}}
{{/each}}
{{/if}}

Current User Text:
"{{currentText}}"

Based on this, provide 3 to 5 alternative, professionally-worded suggestions. The suggestions should be concise, action-oriented, and tailored to the provided context. If the user text is empty, generate suggestions from scratch based on the section and context.`,
});

const suggestResumeTextFlow = ai.defineFlow(
  {
    name: 'suggestResumeTextFlow',
    inputSchema: SuggestResumeTextInputSchema,
    outputSchema: SuggestResumeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
