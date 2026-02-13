'use server';
/**
 * @fileOverview 청소년을 위한 AI 말씀 묵상 해설 생성 플로우
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMeditationInputSchema = z.object({
  verse: z.string().describe('묵상할 성경 구절 (예: 애가 3:22-23)'),
  verseText: z.string().describe('성경 구절의 실제 텍스트'),
});
export type GenerateMeditationInput = z.infer<typeof GenerateMeditationInputSchema>;

const GenerateMeditationOutputSchema = z.object({
  commentary: z.string().describe('청소년 눈높이에 맞춘 힙하고 따뜻한 말씀 해설'),
  question: z.string().describe('아이들이 스스로를 돌아볼 수 있는 질문 (Q1 형태)'),
});
export type GenerateMeditationOutput = z.infer<typeof GenerateMeditationOutputSchema>;

export async function generateMeditation(input: GenerateMeditationInput): Promise<GenerateMeditationOutput> {
  return generateMeditationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMeditationPrompt',
  input: {schema: GenerateMeditationInputSchema},
  output: {schema: GenerateMeditationOutputSchema},
  prompt: `당신은 청소년 사역에 진심인 힙한 전도사님입니다. 
다음 성경 구절을 바탕으로 중고등학생 아이들이 이해하기 쉽고 공감할 수 있는 따뜻한 해설과 질문을 만들어주세요.

---
구절: {{{verse}}}
내용: {{{verseText}}}
---

가이드라인:
1. 말투는 친근하게 (~해요, ~봐요 등).
2. 아이들의 일상(학교, 친구, 학업, 인스타 등)과 연결해서 해설해주세요.
3. 너무 길지 않게 핵심만 전달해주세요.
4. 질문은 아이들이 10자 이상은 충분히 쓸 수 있는 구체적인 질문이어야 합니다.

결과는 반드시 해설(commentary)과 질문(question)으로 나누어 출력하세요.`,
});

const generateMeditationFlow = ai.defineFlow(
  {
    name: 'generateMeditationFlow',
    inputSchema: GenerateMeditationInputSchema,
    outputSchema: GenerateMeditationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
