'use server';
/**
 * @fileOverview 청소년을 위한 데일리 퀴즈 생성 AI 플로우
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizOutputSchema = z.object({
  question: z.string().describe('퀴즈 질문'),
  options: z.array(z.string()).length(4).describe('4개의 선택지'),
  correctIndex: z.number().min(0).max(3).describe('정답 인덱스 (0~3)'),
  explanation: z.string().describe('정답에 대한 쉽고 재미있는 설명'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(): Promise<GenerateQuizOutput> {
  return generateQuizFlow();
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  output: {schema: GenerateQuizOutputSchema},
  prompt: `당신은 중고등학생 아이들과 소통하는 힙한 교회 선생님입니다. 
아이들이 흥미를 느낄 만한 '성경 퀴즈' 또는 '기독교 상식 퀴즈'를 하나 만들어주세요.

작성 가이드라인:
1. 너무 어렵지 않게, 중학생 수준에서 충분히 풀 수 있는 내용이어야 합니다.
2. 질문과 설명에 '전도사님'이나 '선생님'의 말투(~해요, ~죠?)를 사용해 친근하게 작성하세요.
3. 선택지는 아주 명확하게 4개(4지선다)로 구성하세요.
4. 정답 설명(explanation)은 이 퀴즈를 통해 무엇을 배울 수 있는지 2~3문장으로 다정하게 설명해주세요.

반드시 JSON 형식으로 출력하세요.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: z.void(),
    outputSchema: GenerateQuizOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    if (!output) throw new Error("퀴즈 생성에 실패했습니다.");
    return output;
  }
);
