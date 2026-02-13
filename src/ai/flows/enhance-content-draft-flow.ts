'use server';
/**
 * @fileOverview An AI agent that provides suggestions for improving draft content.
 *
 * - enhanceContentDraft - A function that takes draft content and returns AI-powered suggestions.
 * - EnhanceContentDraftInput - The input type for the enhanceContentDraft function.
 * - EnhanceContentDraftOutput - The return type for the enhanceContentDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceContentDraftInputSchema = z.object({
  draftContent: z
    .string()
    .describe(
      'The draft content provided by the user for which suggestions are requested.'
    ),
});
export type EnhanceContentDraftInput = z.infer<typeof EnhanceContentDraftInputSchema>;

const EnhanceContentDraftOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe(
      'AI-powered suggestions for improving the draft content, including rephrasing, expanding sections, or clarifying points.'
    ),
});
export type EnhanceContentDraftOutput = z.infer<typeof EnhanceContentDraftOutputSchema>;

export async function enhanceContentDraft(
  input: EnhanceContentDraftInput
): Promise<EnhanceContentDraftOutput> {
  return enhanceContentDraftFlow(input);
}

const enhanceContentDraftPrompt = ai.definePrompt({
  name: 'enhanceContentDraftPrompt',
  input: {schema: EnhanceContentDraftInputSchema},
  output: {schema: EnhanceContentDraftOutputSchema},
  prompt: `You are an expert content editor and writing assistant. Your goal is to provide constructive and creative suggestions to improve the provided draft content.

Analyze the following draft content and offer specific, actionable suggestions. Focus on areas like:
-   **Clarity and Conciseness**: Suggest rephrasing sentences for better readability or condensing verbose sections.
-   **Expansion**: Identify points that could be elaborated on or suggest additional information that would enrich the content.
-   **Tone and Style**: Propose adjustments to match a desired tone (e.g., more formal, engaging, persuasive).
-   **Structure and Flow**: Suggest ways to improve the organization of ideas or transitions between paragraphs.
-   **Engagement**: Offer ideas to make the content more captivating for the reader.

Present your suggestions clearly, perhaps using bullet points or numbered lists, and explain the reasoning behind each suggestion.

--- Draft Content ---
{{{draftContent}}}

--- AI Suggestions ---`,
});

const enhanceContentDraftFlow = ai.defineFlow(
  {
    name: 'enhanceContentDraftFlow',
    inputSchema: EnhanceContentDraftInputSchema,
    outputSchema: EnhanceContentDraftOutputSchema,
  },
  async (input) => {
    const {output} = await enhanceContentDraftPrompt(input);
    return output!;
  }
);
