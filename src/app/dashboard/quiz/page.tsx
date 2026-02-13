"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const qtDatabase = [
  { 
    id: "qt-1", 
    title: "새벽의 침묵", 
    description: "오늘 하루를 차분한 명상으로 시작해보세요.",
    category: "Morning"
  },
  { 
    id: "qt-2", 
    title: "한낮의 쉼표", 
    description: "복잡한 생각들을 내려놓고 현재에 집중합니다.",
    category: "Afternoon"
  },
  { 
    id: "qt-3", 
    title: "별 헤는 밤", 
    description: "감사했던 일들을 떠올리며 하루를 정리합니다.",
    category: "Evening"
  }
];

const quizDatabase = [
  {
    id: 1,
    question: "웹캔버스의 핵심 가치는 무엇인가요?",
    options: ["창의성", "속도", "협업", "모두 다"],
    answer: "모두 다"
  },
  {
    id: 2,
    question: "리액트에서 상태 관리를 위해 가장 기본적으로 사용하는 훅은?",
    options: ["useEffect", "useState", "useMemo", "useRef"],
    answer: "useState"
  }
];

const shopItems = [
  {
    id: "item-1",
    name: "프로 에디터 팩",
    price: "₩12,000",
    feature: "무제한 AI 글쓰기 제안"
  },
  {
    id: "item-2",
    name: "프리미엄 템플릿",
    price: "₩8,000",
    feature: "50개 이상의 독점 레이아웃"
  },
  {
    id: "item-3",
    name: "다이소 상품권",
    price: "₩5,000",
    feature: "다양한 사무용품 구매 가능"
  },
  {
    id: "item-4",
    name: "치킨",
    price: "2000D",
    feature: "맛있는 황금올리브 치킨"
  }
];

export default function QuizApp() {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (selected: string) => {
    if (selected === quizDatabase[currentQuiz].answer) {
      setScore(s => s + 1);
      toast({ title: "정답입니다! 🎉", description: "점수가 1점 추가되었습니다." });
    } else {
      toast({ title: "아쉽네요! 💡", description: "다음에 다시 도전해보세요.", variant: "destructive" });
    }
    setCurrentQuiz((prev) => (prev + 1) % quizDatabase.length);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          Quiz & Shop <Sparkles className="text-accent" />
        </h1>
        <p className="text-muted-foreground">데이터 전역 관리 패턴이 적용된 예시 페이지입니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-accent/5 overflow-hidden">
            <CardHeader className="border-b bg-background/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-accent w-5 h-5" />
                  <CardTitle className="text-lg">Daily Quiz</CardTitle>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                  Score: {score}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 pb-8 space-y-6">
              <h3 className="text-xl font-bold text-center mb-8">
                {quizDatabase[currentQuiz].question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizDatabase[currentQuiz].options.map(option => (
                  <Button 
                    key={option} 
                    variant="outline" 
                    className="h-16 text-md hover:bg-primary hover:text-white transition-all rounded-xl"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary w-5 h-5" />
              <h2 className="text-xl font-bold font-headline">Latest QT</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {qtDatabase.map(qt => (
                <Card key={qt.id} className="border-none shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">{qt.category}</span>
                    <CardTitle className="text-md">{qt.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">{qt.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-500 w-5 h-5" />
            <h2 className="text-xl font-bold font-headline">Store</h2>
          </div>
          <div className="space-y-4">
            {shopItems.map(item => (
              <Card key={item.id} className="group overflow-hidden border-none shadow-sm hover:shadow-lg transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-md">{item.name}</CardTitle>
                      <CardDescription className="text-[10px]">{item.feature}</CardDescription>
                    </div>
                    <div className="font-bold text-primary">{item.price}</div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <Button className="w-full rounded-lg gap-2 group-hover:bg-accent group-hover:text-accent-foreground h-9 text-xs">
                    구매하기 <ChevronRight className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/10">
            <h3 className="font-bold text-sm mb-2">포인트 안내</h3>
            <p className="text-xs text-muted-foreground">퀴즈를 맞힐 때마다 포인트가 쌓이며, 상점에서 아이템 구매 시 사용할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
