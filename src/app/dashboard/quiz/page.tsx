"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, ShoppingBag, CheckCircle2, Trophy, Zap } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// --- 전역 데이터 스코프 ---
const VIBE_QUIZ = [
  {
    id: 1,
    question: "오늘의 핵심 바이브! '주의 말씀은 내 발에 ○○이요?'",
    options: ["손전등", "등불", "헤드라이트", "스포트라이트"],
    answer: "등불"
  },
  {
    id: 2,
    question: "세상 시선보다 중요한 것은?",
    options: ["좋아요 수", "팔로워 수", "하나님의 시선", "최신 유행"],
    answer: "하나님의 시선"
  }
];

const SHOP_ITEMS = [
  { id: "s1", name: "힙합 묵상 스티커팩", price: "500 P", desc: "노트북 꾸미기 필수템", badge: "Hit" },
  { id: "s2", name: "AI 딥해석권 (5회)", price: "1,000 P", desc: "어려운 말씀도 1초 컷", badge: "New" },
  { id: "s3", name: "황금올리브 치킨", price: "2,000 D", desc: "갓생 산 너에게 주는 선물", badge: "Flex" }
];

export default function VibeQuizShop() {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedScore = localStorage.getItem('vibeword_score');
    if (savedScore) setScore(parseInt(savedScore));
  }, []);

  const handleAnswer = (selected: string) => {
    if (selected === VIBE_QUIZ[currentQuiz].answer) {
      const newScore = score + 100;
      setScore(newScore);
      localStorage.setItem('vibeword_score', newScore.toString());
      toast({ 
        title: "VIBE CHECK PASS! 🤘", 
        description: "100포인트 획득! 역시 넌 힙해.",
      });
    } else {
      toast({ 
        title: "오답도 힙하게! 💡", 
        description: `다시 한번 묵상해보자. 정답은 "${VIBE_QUIZ[currentQuiz].answer}"`, 
        variant: "destructive" 
      });
    }
    
    setTimeout(() => {
      setCurrentQuiz((prev) => (prev + 1) % VIBE_QUIZ.length);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Badge className="bg-primary/20 text-primary border-none font-black px-4 py-1 uppercase tracking-widest text-[10px]">Level Up Studio</Badge>
          <h1 className="text-5xl font-black tracking-tighter flex items-center gap-3 italic">
            Vibe Check <Zap className="text-accent fill-accent animate-bounce" />
          </h1>
          <p className="text-muted-foreground text-xl font-medium">퀴즈 풀고 힙한 아이템 Flex 하러 가자!</p>
        </div>
        <div className="flex items-center gap-6 bg-black text-white p-6 rounded-[2rem] shadow-2xl rotate-1">
           <div className="flex flex-col">
              <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Available Vibe</span>
              <span className="text-3xl font-black text-accent italic">{score.toLocaleString()} P</span>
           </div>
           <div className="h-12 w-[1px] bg-white/10" />
           <Trophy className="w-10 h-10 text-yellow-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Quiz Card */}
          <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary text-white p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black italic">Today's Vibe Check</CardTitle>
                </div>
                <Badge className="bg-white text-primary font-black px-4 py-1">Q {currentQuiz + 1}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10 text-center">
              <h3 className="text-3xl font-black leading-tight max-w-lg mx-auto italic">
                {VIBE_QUIZ[currentQuiz].question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VIBE_QUIZ[currentQuiz].options.map((option, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    className="h-24 text-xl hover:border-accent hover:bg-accent/5 transition-all rounded-[1.5rem] border-2 flex flex-col gap-1 items-center justify-center font-black group relative overflow-hidden"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="text-[10px] text-gray-400 absolute top-3 left-4">OPTION {idx + 1}</span>
                    <span>{option}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-accent/10 border border-accent/20 space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <CheckCircle2 className="text-accent" /> 포인트 획득 팁
              </h3>
              <ul className="space-y-2 text-sm font-bold text-gray-600">
                <li>• 퀴즈 정답 시 100포인트!</li>
                <li>• 연속 참여 시 보너스 바이브!</li>
                <li>• 포인트는 상점에서 즉시 사용 가능</li>
              </ul>
            </div>
            <div className="p-8 rounded-[2rem] bg-primary/10 border border-primary/20 space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <BookOpen className="text-primary" /> 말씀 바이브란?
              </h3>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                단순한 지식이 아니라, 내 삶에 녹아든 하나님의 멋을 체크하는 시간이야!
              </p>
            </div>
          </div>
        </div>

        {/* Store Sidebar */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
            <ShoppingBag className="text-primary" /> Vibe Shop
          </h2>
          <div className="space-y-4">
            {SHOP_ITEMS.map(item => (
              <Card key={item.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem]">
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <CardTitle className="text-xl font-black italic">{item.name}</CardTitle>
                    {item.badge && <Badge className="bg-accent text-white font-black text-[10px]">{item.badge}</Badge>}
                  </div>
                  <CardDescription className="font-bold text-gray-400">{item.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <div className="font-black text-2xl text-primary italic">{item.price}</div>
                  <Button className="rounded-2xl px-8 bg-black hover:bg-gray-800 shadow-lg font-black group-hover:-translate-y-1 transition-transform">Buy</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}