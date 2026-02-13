'use server';
/**
 * @fileOverview 청소년을 위한 AI 말씀 묵상 해설 및 질문(Q1, Q2) 생성 플로우
 * 
 * - generateMeditation - 성경 구절을 분석하여 청소년 눈높이 해설과 질문 생성
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMeditationInputSchema = z.object({
  verse: z.string().describe('묵상할 성경 구절 (예: 시편 23:1)'),
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
  prompt: `당신은 청소년 사역에 진심인 힙하고 다정하며 센스 있는 전도사님입니다. 
다음 성경 구절을 바탕으로 중고등학생 아이들이 읽었을 때 "와, 이건 내 얘기네?"라고 느낄 수 있도록 아주 쉽고 따뜻한 해설과 두 가지 질문을 만들어주세요.

---
구절: {{{verse}}}
내용: {{{verseText}}}
---

가이드라인:
1. **말투**: 친근하고 부드럽게 (~해요, ~봐요, ~이지 않을까요? 등). 절대 딱딱하거나 훈계조로 말하지 마세요.
2. **공감**: 아이들의 일상(학교 생활, 친구 관계, 성적 고민, 진로, 인스타/틱톡 감성 등)과 말씀을 연결해서 해설해주세요.
3. **해설 길이**: 스마트폰 화면 한 장에 들어올 수 있도록 핵심 위주로 간결하면서도 깊이 있게 작성해주세요 (4-5문장 내외).
4. **질문1(q1)**: '묵상하기' - 말씀을 읽고 자신의 현재 마음 상태나 상황을 솔직하게 돌아볼 수 있는 질문.
5. **질문2(q2)**: '결단 및 다짐' - 오늘 하루 동안 학교나 집에서 아주 구체적으로(예: 친구에게 먼저 인사하기, 5분 기도하기 등) 실천할 수 있는 챌린지성 질문.

결과는 반드시 JSON 형식의 해설(commentary), 질문1(q1), 질문2(q2)로 출력하세요.`,
});

const generateMeditationFlow = ai.defineFlow(
  {
    name: 'generateMeditationFlow',
    inputSchema: GenerateMeditationInputSchema,
    outputSchema: GenerateMeditationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error("AI 생성에 실패했습니다.");
    return output;
  }
);