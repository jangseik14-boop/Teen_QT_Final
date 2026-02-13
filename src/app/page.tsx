"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, ShoppingBag, CheckCircle2, ChevronRight, Trophy, Zap, MessageCircle, Heart, Share2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from 'next/image';

// --- 전역 데이터 스코프 ---
const DAILY_VERSE = {
  reference: "시편 119:105",
  text: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다",
  vibe: "막막한 내 인생, 하나님 말씀이 내비게이션이야! 🧭"
};

const QT_CARDS = [
  {
    id: "qt-1",
    title: "갓생 사는 법",
    verse: "잠언 16:3",
    desc: "계획은 내가 짜도, 결과는 하나님 손에! 오늘 하루를 맡겨봐.",
    tag: "Goal",
    color: "bg-blue-500"
  },
  {
    id: "qt-2",
    title: "비교 금지 구역",
    verse: "갈라디아서 1:10",
    desc: "사람들 좋아요 수에 일희일비하지 마. 넌 이미 최고니까.",
    tag: "Self-love",
    color: "bg-accent"
  },
  {
    id: "qt-3",
    title: "멘탈 관리 레시피",
    verse: "빌립보서 4:6",
    desc: "불안할 땐 걱정 대신 기도로 Flex 해버려. 평안이 올 거야.",
    tag: "Mind",
    color: "bg-purple-500"
  }
];

const SHOP_ITEMS = [
  { id: "s1", name: "힙합 묵상 스티커팩", price: "500 P", desc: "노트북, 패드 꾸미기 필수템", badge: "Hit" },
  { id: "s2", name: "AI 딥해석권 (5회)", price: "1,000 P", desc: "어려운 말씀도 1초 만에 요약", badge: "New" },
  { id: "s3", name: "황금올리브 치킨", price: "2,000 D", desc: "치킨은 역시 비비큐, 오늘 저녁 가보자고!", badge: "Flex" }
];

export default function Home() {
  const [score, setScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedScore = localStorage.getItem('vibeword_score');
    if (savedScore) setScore(parseInt(savedScore));
  }, []);

  const addPoint = () => {
    const newScore = score + 50;
    setScore(newScore);
    localStorage.setItem('vibeword_score', newScore.toString());
    toast({
      title: "Vibe Point Up! 🔥",
      description: "50포인트가 적립되었습니다. 갓생 인정!",
    });
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-xl rotate-3 shadow-lg">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">VibeWord</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-full font-bold">Dashboard</Button>
            </Link>
            <div className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              {score.toLocaleString()} P
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section: Today's Vibe */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-black text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full -ml-20 -mb-20" />
          
          <div className="relative z-10 space-y-6">
            <Badge className="bg-white/10 text-white border-none backdrop-blur-md px-4 py-1">TODAY'S WORD</Badge>
            <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-3xl italic">
              "{DAILY_VERSE.text}"
            </h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-xl font-bold text-accent">{DAILY_VERSE.reference}</p>
                <p className="text-white/60 font-medium">{DAILY_VERSE.vibe}</p>
              </div>
              <Button onClick={addPoint} size="lg" className="bg-white text-black hover:bg-white/90 rounded-2xl font-black text-lg h-16 px-8 shadow-xl hover:scale-105 transition-transform">
                말씀 충전하기 <Zap className="ml-2 fill-current" />
              </Button>
            </div>
          </div>
        </section>

        {/* Content Tabs-like grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tighter">New Vibe Cards</h2>
              <Button variant="link" className="font-bold text-primary">See All <ChevronRight className="w-4 h-4" /></Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QT_CARDS.map((card) => (
                <Card key={card.id} className="border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer overflow-hidden rounded-[2rem]">
                  <div className={`h-2 ${card.color} group-hover:h-3 transition-all`} />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-none font-bold uppercase text-[10px]">#{card.tag}</Badge>
                      <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors" />
                    </div>
                    <CardTitle className="text-2xl font-black">{card.title}</CardTitle>
                    <CardDescription className="font-bold text-primary">{card.verse}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-medium leading-relaxed">{card.desc}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t border-gray-50 bg-gray-50/50">
                    <div className="flex gap-2">
                       <MessageCircle className="w-4 h-4 text-gray-400" />
                       <Share2 className="w-4 h-4 text-gray-400" />
                    </div>
                    <Button variant="ghost" size="sm" className="font-bold">딥하게 보기</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* AI Generator Placeholder */}
            <div className="p-10 rounded-[2.5rem] hip-card-gradient border border-primary/10 space-y-6 text-center">
              <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="text-accent w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">말씀 해석이 막막해?</h3>
                <p className="text-gray-600 font-medium italic">Vibe AI가 요즘 언어로 싹 정리해줄게!</p>
              </div>
              <Button className="rounded-full px-8 h-12 font-black shadow-lg" asChild>
                <Link href="/dashboard/ai">AI 바이브 체크하기</Link>
              </Button>
            </div>
          </div>

          {/* Side Shop */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter">Vibe Shop</h2>
            <div className="space-y-4">
              {SHOP_ITEMS.map((item) => (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
                  <CardHeader className="p-5 pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                      {item.badge && <Badge className="bg-accent text-white font-black text-[10px] uppercase">{item.badge}</Badge>}
                    </div>
                    <CardDescription className="text-xs font-medium">{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 flex items-center justify-between">
                    <span className="text-xl font-black text-primary">{item.price}</span>
                    <Button className="rounded-2xl px-6 bg-black hover:bg-gray-800 shadow-md group-hover:-translate-y-1 transition-transform">Get it</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interactive Info Card */}
            <div className="bg-accent rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl rotate-1">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <h3 className="text-2xl font-black">Vibe Point Guide</h3>
              </div>
              <ul className="space-y-3 font-bold text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 매일 말씀 읽기 (+50 P)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 친구랑 공유하기 (+20 P)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 묵상 글 작성하기 (+100 P)</li>
              </ul>
              <p className="text-xs text-white/60 pt-2 font-medium">포인트를 모아 힙한 아이템으로 교환하세요!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white px-8 py-4 rounded-full flex items-center gap-10 shadow-2xl backdrop-blur-lg border border-white/10 z-[100]">
        <Link href="/" className="flex flex-col items-center gap-1">
          <Zap className="w-6 h-6 text-accent fill-accent" />
          <span className="text-[10px] font-bold">HOME</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-bold">FEED</span>
        </Link>
        <Link href="/dashboard/ai" className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px] font-bold">AI</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold">SHOP</span>
        </Link>
      </nav>
    </div>
  );
}