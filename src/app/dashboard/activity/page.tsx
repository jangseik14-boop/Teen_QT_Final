
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Trophy, 
  BookOpen, 
  ShoppingBag, 
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  Star,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, setDocumentNonBlocking, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { generateQuiz } from "@/ai/flows/generate-quiz";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const getTodayId = () => new Date().toISOString().split('T')[0];

export default function ActivityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const todayId = getTodayId();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 사용자 프로필 참조
  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  // 오늘의 공통 퀴즈 참조 (모든 유저 동일)
  const globalQuizRef = useMemoFirebase(() => doc(firestore, "dailyQuizzes", todayId), [firestore, todayId]);
  const { data: dailyQuiz, isLoading: isQuizLoading } = useDoc(globalQuizRef);

  // 현재 유저의 퀴즈 참여 기록 참조
  const userActivityRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/activities/${todayId}`) : null, [user, firestore, todayId]);
  const { data: userActivity } = useDoc(userActivityRef);

  // 퀴즈가 없으면 생성하여 전역 저장소에 저장하는 로직
  useEffect(() => {
    const fetchOrGenerateQuiz = async () => {
      // 이미 퀴즈가 있거나 생성 중이면 중단
      if (isQuizLoading || dailyQuiz?.question || isGenerating) return;

      setIsGenerating(true);
      try {
        const result = await generateQuiz();
        if (result && result.question) {
          // 중앙 저장소에 오늘 날짜의 퀴즈 저장 (최초 1회만 실행됨)
          setDocumentNonBlocking(globalQuizRef, {
            ...result,
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (error) {
        console.error("퀴즈 생성 실패:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    if (user && !isQuizLoading) {
      fetchOrGenerateQuiz();
    }
  }, [dailyQuiz, isQuizLoading, user, globalQuizRef, isGenerating]);

  const handleQuizSubmit = () => {
    if (selectedOption === null || !dailyQuiz || userActivity) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption === dailyQuiz.correctIndex;

    // 참여 기록 저장
    setDocumentNonBlocking(userActivityRef!, {
      completedAt: new Date().toISOString(),
      isCorrect,
      selectedOption,
      rewarded: isCorrect ? 20 : 0
    }, { merge: true });

    if (isCorrect) {
      const currentPoints = userProfile?.points || 0;
      const currentTotalPoints = userProfile?.totalPoints || 0;
      updateDocumentNonBlocking(userRef!, {
        points: currentPoints + 20,
        totalPoints: currentTotalPoints + 20
      });
      toast({ title: "정답입니다! 🎉", description: "20달란트가 적립되었습니다." });
    } else {
      toast({ title: "아쉬워요! 😢", description: "정답이 아니네요. 해설을 읽어보세요!" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8FAFC] min-h-screen pb-32 shadow-2xl overflow-hidden relative border-x border-gray-100 font-body">
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#C026D3] tracking-tight italic">예본Teen활동</h1>
          <p className="text-gray-400 text-[13px] font-bold">매일매일 즐거운 신앙 루틴!</p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">{(userProfile?.points || 0).toLocaleString()} D</span>
        </div>
      </header>

      <div className="px-6 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-black text-gray-800 italic">오늘의 데일리 퀴즈</h2>
          </div>

          {!dailyQuiz && (isGenerating || isQuizLoading) ? (
            <Card className="border-none shadow-sm rounded-[2rem] bg-white p-10 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <p className="text-sm font-bold text-gray-400">AI가 오늘의 공통 퀴즈를 만드는 중...</p>
            </Card>
          ) : (
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-gray-100">
              <CardContent className="p-8 space-y-6">
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 relative">
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-300 animate-pulse" />
                  <p className="text-lg font-black text-purple-900 leading-tight">
                    {dailyQuiz?.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {dailyQuiz?.options.map((option: string, index: number) => {
                    const isCompleted = !!userActivity || isSubmitted;
                    const isCorrect = index === dailyQuiz.correctIndex;
                    const isSelected = selectedOption === index || userActivity?.selectedOption === index;
                    
                    let variantClass = "bg-gray-50 border-gray-100 text-gray-700";
                    if (isSelected && !isCompleted) variantClass = "bg-purple-100 border-purple-300 text-purple-700 ring-2 ring-purple-200";
                    if (isCompleted && isCorrect) variantClass = "bg-green-100 border-green-300 text-green-700 ring-2 ring-green-200";
                    if (isCompleted && isSelected && !isCorrect) variantClass = "bg-rose-100 border-rose-300 text-rose-700";

                    return (
                      <button
                        key={index}
                        disabled={isCompleted}
                        onClick={() => setSelectedOption(index)}
                        className={cn(
                          "w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all duration-200 flex justify-between items-center group",
                          variantClass
                        )}
                      >
                        <span>{index + 1}. {option}</span>
                        {isCompleted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        {isCompleted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {!(userActivity || isSubmitted) ? (
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={selectedOption === null}
                    className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 font-black text-lg shadow-lg shadow-purple-100"
                  >
                    정답 확인하고 20D 받기
                  </Button>
                ) : (
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 space-y-2 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <p className="text-xs font-black text-amber-700 uppercase tracking-wider">선생님의 해설</p>
                    </div>
                    <p className="text-[13px] font-bold text-amber-900 leading-relaxed">
                      {dailyQuiz?.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4 pb-10">
          <div className="flex items-center gap-2 px-1">
            <Trophy className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-black text-gray-800 italic">진행 중인 이벤트</h2>
          </div>
          <Card className="border-none shadow-sm rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white overflow-hidden relative">
            <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-20" />
            <div className="relative z-10 space-y-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-bold">상시 진행</Badge>
              <h3 className="text-xl font-black">7일 연속 묵상 챌린지!</h3>
              <p className="text-xs font-bold text-blue-100">일주일 동안 하루도 빠짐없이 묵상하면<br/>특별 보너스 200달란트를 드려요!</p>
            </div>
          </Card>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t-2 border-blue-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group text-gray-400">
          <BookOpen className="w-6 h-6" />
          <span className="text-[11px] font-bold">QT</span>
        </Link>
        <Link href="/dashboard/activity" className="flex flex-col items-center gap-1 group">
          <Zap className="w-6 h-6 text-[#C026D3] fill-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">활동</span>
        </Link>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400">
          <Trophy className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400">
          <UserIcon className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", className)}>{children}</span>;
}
