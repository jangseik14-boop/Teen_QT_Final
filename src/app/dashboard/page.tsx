
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Star, 
  PartyPopper, 
  Trophy, 
  ShoppingBag, 
  User, 
  ChevronRight,
  BookMarked
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user } = useUser();
  const [points, setPoints] = useState(99999974849);
  const [reflection, setReflection] = useState("");

  const userName = user?.displayName || "장세익";

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-xl rounded-[3rem] overflow-hidden relative border border-gray-100">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight">
            예본TeenQT
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            환영합니다, {userName}님!
          </p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">
            {points.toLocaleString()} D
          </span>
        </div>
      </header>

      <div className="px-5 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pb-10">
        {/* Date & Title Card */}
        <Card className="border-none bg-[#EEF2FF] rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 space-y-3">
            <p className="text-[#6366F1] font-bold text-sm">
              2026년 2월 13일 금
            </p>
            <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight">
              아침마다 새로운 긍휼
            </h2>
            <div className="flex items-center gap-2 text-[#6366F1]">
              <BookMarked className="w-4 h-4" />
              <span className="font-bold text-sm">애가 3:22-23</span>
            </div>
          </CardContent>
        </Card>

        {/* Verse Quote Card */}
        <Card className="border-none bg-[#F0F9FF] rounded-[2rem]">
          <CardContent className="p-8 text-center italic text-[#0369A1] font-bold text-lg leading-relaxed">
            "여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다"
          </CardContent>
        </Card>

        {/* Meditation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-6 bg-[#EC4899] rounded-full" />
            <h3 className="font-black text-lg text-gray-800 italic">말씀 묵상</h3>
          </div>
          <Card className="border-none bg-[#FDF2F8] rounded-[2rem]">
            <CardContent className="p-7 text-gray-600 font-medium leading-relaxed text-[15px]">
              우리는 매일 똑같은 실수를 반복하고 넘어집니다. 그럼에도 우리가 망하지 않고 살 수 있는 이유는, 하나님의 사랑과 용서가 매일 아침 뜨는 해처럼 항상 새롭고 끝이 없기 때문입니다.
            </CardContent>
          </Card>
        </div>

        {/* Reflection Input Section */}
        <div className="space-y-4">
          <Card className="border-none bg-[#FFFBEB] rounded-[2rem] p-7 space-y-5">
            <div className="space-y-2">
              <h3 className="font-black text-lg text-[#92400E]">묵상하기</h3>
              <p className="text-[#B45309] text-sm font-bold leading-relaxed">
                Q1. 어제 지은 죄를 오늘 또 지어서 염치없고 죄송한 마음에 기도를 포기한 적이 있나요?
              </p>
            </div>
            <div className="relative">
              <Textarea 
                placeholder="10자 이상..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="bg-white border-yellow-100 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none"
              />
            </div>
          </Card>
        </div>

        {/* Resolution Section */}
        <div className="space-y-4 pb-4">
           <div className="flex justify-between items-center px-1">
             <h3 className="font-black text-lg text-gray-800">결단 및 다짐</h3>
             <ChevronRight className="w-5 h-5 text-gray-400" />
           </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
          <BookOpen className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">QT</span>
        </Link>
        <Link href="/dashboard/events" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <PartyPopper className="w-6 h-6" />
          <span className="text-[11px] font-bold">이벤트</span>
        </Link>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <Trophy className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}
