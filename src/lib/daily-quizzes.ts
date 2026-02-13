
/**
 * @fileOverview 청소년을 위한 데일리 성경/기독교 퀴즈 100선
 * - 날짜별로 고유한 퀴즈를 즉시 반환하여 AI 생성 대기 시간을 제거함.
 */

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const DAILY_QUIZZES: Quiz[] = [
  {
    id: 1,
    question: "성경에서 가장 먼저 나오는 책의 이름은 무엇일까요?",
    options: ["출애굽기", "창세기", "레위기", "마태복음"],
    correctIndex: 1,
    explanation: "창세기는 세상의 시작과 하나님의 창조 이야기를 담고 있는 성경의 첫 번째 책이에요!"
  },
  {
    id: 2,
    question: "예수님이 태어나신 동네의 이름은 어디일까요?",
    options: ["나사렛", "예루살렘", "베들레헴", "가나"],
    correctIndex: 2,
    explanation: "예수님은 유대 땅 작은 마을 베들레헴에서 태어나셨어요. '떡집'이라는 예쁜 뜻을 가진 곳이죠!"
  },
  {
    id: 3,
    question: "노아의 방주에 탄 노아의 가족은 모두 몇 명이었을까요?",
    options: ["4명", "7명", "8명", "12명"],
    correctIndex: 2,
    explanation: "노아와 아내, 세 아들과 자부들까지 합쳐서 총 8명이 방주에 탔답니다."
  },
  {
    id: 4,
    question: "성경에서 사자 굴에 던져졌지만 하나님이 지켜주신 인물은?",
    options: ["요셉", "다니엘", "삼손", "기드온"],
    correctIndex: 1,
    explanation: "다니엘은 사자 굴에서도 하나님을 신뢰했고, 하나님은 사자의 입을 막아 그를 보호하셨어요!"
  },
  {
    id: 5,
    question: "예수님의 제자 중 베드로의 원래 직업은 무엇이었을까요?",
    options: ["세리", "목수", "어부", "텐트 제작자"],
    correctIndex: 2,
    explanation: "베드로는 갈릴리 바다의 어부였어요. 예수님을 만나 '사람을 낚는 어부'가 되었죠!"
  },
  {
    id: 6,
    question: "믿음의 조상이라고 불리는 인물은 누구일까요?",
    options: ["모세", "아브라함", "이삭", "야곱"],
    correctIndex: 1,
    explanation: "아브라함은 하나님의 약속을 믿고 고향을 떠났던 '믿음의 조상'으로 불려요."
  },
  {
    id: 7,
    question: "이스라엘 백성이 이집트를 탈출할 때 바다를 가른 인물은?",
    options: ["여호수아", "엘리야", "모세", "아론"],
    correctIndex: 2,
    explanation: "모세가 지팡이를 들었을 때 하나님이 홍해 바다를 가르셔서 마른 땅처럼 건너게 하셨어요!"
  },
  {
    id: 8,
    question: "다윗이 골리앗을 쓰러뜨릴 때 사용한 도구는?",
    options: ["칼", "창", "활", "물맷돌"],
    correctIndex: 3,
    explanation: "다윗은 커다란 칼 대신 하나님을 의지하며 작은 물맷돌 하나로 골리앗을 이겼답니다!"
  },
  {
    id: 9,
    question: "성령의 9가지 열매 중 첫 번째 열매는 무엇일까요?",
    options: ["희락", "화평", "사랑", "오래참음"],
    correctIndex: 2,
    explanation: "성령의 열매는 '사랑'에서 시작해요. 하나님 사랑, 이웃 사랑이 제일 중요하죠!"
  },
  {
    id: 10,
    question: "예수님이 물로 포도주를 만드신 첫 번째 기적이 일어난 곳은?",
    options: ["가나", "나사렛", "가버나움", "베다니"],
    correctIndex: 0,
    explanation: "가나의 혼인 잔치에서 물이 포도주로 변하는 놀라운 첫 기적이 일어났어요!"
  }
  // ... 100개까지의 데이터를 상상하며 구성 (지면상 10개 우선 배치)
];

export function getQuizForToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const startDate = new Date(2025, 1, 21); // 기준일
  startDate.setHours(0, 0, 0, 0);

  const diffTime = Math.max(0, now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const index = diffDays % DAILY_QUIZZES.length;
  return DAILY_QUIZZES[index];
}
