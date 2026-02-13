"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, ShoppingBag, CheckCircle2, ChevronRight, Trophy, Layout } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

// 데이터 변수들을 컴포넌트 외부(전역 스코프)로 이동
const qtDatabase = [
  { 
    id: "qt-1", 
    title: "새벽의 침묵", 
    description: "오늘 하루를 차분한 명상으로 시작해보세요. 조용한 시간 속에서 내면의 목소리에 귀를 기울입니다.",
    category: "Morning"
  },
  { 
    id: "qt-2", 
    title: "한낮의 쉼표", 
    description: "복잡한 생각들을 잠시 내려놓고 현재의 순간에 집중합니다. 호흡을 가다듬고 여유를 찾아보세요.",
    category: "Afternoon"
  },
  { 
    id: "qt-3", 
    title: "별 헤는 밤", 
    description: "오늘 하루 감사했던 일들을 떠올리며 평온하게 마무리합니다. 내일의 희망을 꿈꾸는 시간입니다.",
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
  },
  {
    id: 3,
    question: "Next.js에서 서버 사이드 렌더링을 지원하는 가장 큰 이유는?",
    options: ["보안", "SEO 및 초기 로딩 속도", "디자인", "파일 크기"],
    answer: "SEO 및 초기 로딩 속도"
  }
];

const shopItems = [
  {
    id: "item-1",
    name: "프로 에디터 팩",
    price: "12,000 P",
    feature: "무제한 AI 글쓰기 제안 및 고급 교정 기능",
    badge: "Hot"
  },
  {
    id: "item-2",
    name: "프리미엄 템플릿",
    price: "8,000 P",
    feature: "50개 이상의 독점 레이아웃과 디자인 에셋",
    badge: "New"
  },
  {
    id: "item-3",
    name: "다이소 상품권",
    price: "5,000 P",
    feature: "전국 다이소 매장에서 사용 가능한 모바일 쿠폰"
  },
  {
    id: "item-4",
    name: "황금올리브 치킨",
    price: "2,000 D",
    feature: "바삭하고 고소한 황금빛 유혹, 오늘 저녁은 치킨!",
    badge: "Best"
  }
];

export default function QuizApp() {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (selected: string) => {
    if (selected === quizDatabase[currentQuiz].answer) {
      setScore(s => s + 10);
      toast({ 
        title: "정답입니다! 🎉", 
        description: "포인트가 10점 추가되었습니다.",
      });
    } else {
      toast({ 
        title: "아쉽네요! 💡", 
        description: `정답은 "${quizDatabase[currentQuiz].answer}"입니다.`, 
        variant: "destructive" 
      });
    }
    
    setTimeout(() => {
      setCurrentQuiz((prev) => (prev + 1) % quizDatabase.length);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
            <Layout className="w-6 h-6" />
            <span>WebCanvas</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Interactive Studio</Badge>
            <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
              Quiz & Shop <Sparkles className="text-accent animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-lg">퀴즈를 풀고 얻은 포인트로 상점에서 특별한 아이템을 구매하세요.</p>
          </div>
          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm">
             <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-bold uppercase">My Points</span>
                <span className="text-2xl font-bold text-primary">{score} P</span>
             </div>
             <div className="h-10 w-[1px] bg-border mx-2" />
             <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl bg-gradient-to-br from-card to-accent/5 overflow-hidden">
              <CardHeader className="border-b bg-background/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Daily Quiz</CardTitle>
                      <CardDescription>질문을 읽고 정답을 골라주세요.</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">Question {currentQuiz + 1}/{quizDatabase.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-10 pb-10 space-y-8">
                <h3 className="text-2xl font-bold text-center leading-tight max-w-lg mx-auto">
                  {quizDatabase[currentQuiz].question}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizDatabase[currentQuiz].options.map((option, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="h-20 text-lg hover:border-primary hover:bg-primary/5 transition-all rounded-2xl border-2 flex flex-col gap-1 items-center justify-center group"
                      onClick={() => handleAnswer(option)}
                    >
                      <span className="text-xs text-muted-foreground group-hover:text-primary/70">{idx + 1}. Option</span>
                      <span className="font-semibold">{option}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 py-4 flex justify-center border-t">
                <p className="text-sm text-muted-foreground italic">매일 새로운 퀴즈가 업데이트 됩니다.</p>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold font-headline">Latest QT</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {qtDatabase.map(qt => (
                  <Card key={qt.id} className="border-none shadow-md hover:shadow-lg transition-all group">
                    <CardHeader className="p-5">
                      <Badge className="mb-2 bg-primary/10 text-primary border-none hover:bg-primary/20">{qt.category}</Badge>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{qt.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{qt.description}</p>
                    </CardContent>
                    <CardFooter className="p-5 pt-0">
                      <Button variant="link" className="p-0 h-auto text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ChevronRight className="w-3 h-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className="bg-blue-500 p-2 rounded-lg text-white">
                  <ShoppingBag className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-bold font-headline">Store</h2>
            </div>
            
            <div className="space-y-4">
              {shopItems.map(item => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all relative">
                  {item.badge && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        {item.badge}
                      </div>
                    </div>
                  )}
                  <CardHeader className="p-5 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="text-xs leading-snug">{item.feature}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex items-center justify-between">
                    <div className="font-bold text-xl text-primary">{item.price}</div>
                    <Button className="rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-md group-hover:translate-y-[-2px] transition-transform">
                      구매하기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-inner relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Trophy className="w-32 h-32" />
              </div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-primary" />
                 포인트 안내
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground relative z-10">
                <li>• 퀴즈 정답 시 10 포인트가 지급됩니다.</li>
                <li>• 하루 최대 3번까지 퀴즈에 참여 가능합니다.</li>
                <li>• 획득한 포인트는 유효기간이 없습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
