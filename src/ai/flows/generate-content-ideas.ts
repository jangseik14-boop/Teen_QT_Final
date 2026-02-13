'use server';
/**
 * @fileOverview A content idea generation AI agent.
 *
 * - generateContentIdeas - A function that handles the content idea generation process.
 * - GenerateContentIdeasInput - The input type for the generateContentIdeas function.
 * - GenerateContentIdeasOutput - The return type for the generateContentIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentIdeasInputSchema = z.object({
  topic: z.string().describe('The topic or keywords for which to generate content ideas.'),
});
export type GenerateContentIdeasInput = z.infer<typeof GenerateContentIdeasInputSchema>;

const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of content ideas or outlines based on the provided topic.'),
});
export type GenerateContentIdeasOutput = z.infer<typeof GenerateContentIdeasOutputSchema>;

export async function generateContentIdeas(input: GenerateContentIdeasInput): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: {schema: GenerateContentIdeasInputSchema},
  output: {schema: GenerateContentIdeasOutputSchema},
  prompt: `You are an AI assistant specialized in generating creative content ideas and outlines.\nThe user will provide a topic or keywords, and you need to generate a list of diverse and engaging content ideas or outlines.\nEach idea should be a brief but compelling suggestion for an article, blog post, or social media content.\n\nTopic: {{{topic}}}\n\nPlease provide at least 5 distinct content ideas.`,
});

const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
