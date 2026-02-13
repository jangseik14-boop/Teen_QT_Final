'use server';
/**
 * @fileOverview 청소년을 위한 AI 말씀 묵상 해설 및 질문(Q1, Q2) 생성 플로우
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
  q1: z.string().describe('묵상하기 질문 (Q1)'),
  q2: z.string().describe('결단 및 다짐 질문 (Q2)'),
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
다음 성경 구절을 바탕으로 중고등학생 아이들이 이해하기 쉽고 공감할 수 있는 따뜻한 해설과 두 가지 질문을 만들어주세요.

---
구절: {{{verse}}}
내용: {{{verseText}}}
---

가이드라인:
1. 말투는 친근하게 (~해요, ~봐요 등).
2. 아이들의 일상(학교, 친구, 학업, 인스타 등)과 연결해서 해설해주세요.
3. 질문1(q1): 말씀을 읽고 자신의 마음이나 상황을 돌아볼 수 있는 질문.
4. 질문2(q2): 오늘 하루 동안 구체적으로 무엇을 실천하거나 다짐할 수 있을지 이끌어주는 질문.

결과는 반드시 해설(commentary), 질문1(q1), 질문2(q2)로 나누어 출력하세요.`,
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
