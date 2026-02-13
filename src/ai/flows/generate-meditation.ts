
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
  commentary: z.string().describe('청소년 눈높이에 맞춘 구체적이고 따뜻한 말씀 해설'),
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
다음 성경 구절을 바탕으로 중고등학생 아이들의 일상과 고민(학교, 성적, 친구, SNS 등)에 깊이 공감하는 말씀 해설과 두 가지 구체적인 질문을 만들어주세요.

---
구절: {{{verse}}}
내용: {{{verseText}}}
---

작성 가이드라인:
1. **말씀해설(commentary)**: 
   - 아주 쉽고 친근하게 (~해요, ~죠? 등의 어투) 작성하세요.
   - 아이들의 실제 상황(예: 시험 기간, 친구와의 갈등, 외모 고민 등)을 예시로 들어 말씀의 의미를 풀어주세요.
   - 단순히 좋은 말이 아니라, 이 구절이 오늘 나에게 왜 필요한지 'Vibe' 있게 설명해주세요.
   - 분량은 5~6문장 정도로 충분히 깊이 있게 작성해주세요.

2. **Q1. 묵상하기(q1)**: 
   - 말씀의 메시지를 자신의 삶에 비추어 솔직하게 돌아보게 하는 질문이어야 합니다.
   - 출력 시 "Q1." 접두사 없이 질문 내용만 작성하세요 (UI에서 자동으로 붙임).

3. **Q2. 결단 및 다짐(q2)**: 
   - 오늘 당장 학교나 집에서 실천할 수 있는 아주 구체적인 '액션 플랜'을 유도하는 질문이어야 합니다.
   - 출력 시 "Q2." 접두사 없이 질문 내용만 작성하세요 (UI에서 자동으로 붙임).

반드시 JSON 형식으로 출력하세요.`,
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
