
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Trophy, 
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  HelpCircle,
  Gift
} from "lucide-react";
import { useUser, useFirestore, useDoc, useCollection, setDocumentNonBlocking, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import { getQuizForToday } from "@/lib/daily-quizzes";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const getTodayId = () => new Date().toISOString().split('T')[0];

export default function ActivityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const todayId = getTodayId();
  const currentQuiz = getQuizForToday();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // 사용자 프로필 참조
  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  // 현재 유저의 퀴즈 참여 기록 참조
  const userActivityRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/activities/${todayId}`) : null, [user, firestore, todayId]);
  const { data: userActivity, isLoading: isActivityLoading } = useDoc(userActivityRef);

  // 최근 7일간의 묵상 기록 확인
  const meditationsQuery = useMemoFirebase(() => user ? query(
    collection(firestore, `users/${user.uid}/meditations`),
    orderBy("completedAt", "desc"),
    limit(10)
  ) : null, [user, firestore]);
  const { data: recentMeditations } = useCollection(meditationsQuery);

  // 연속 묵상 일수 계산 로직
  const streakInfo = useMemo(() => {
    if (!recentMeditations) return { count: 0, isEligible: false };
    
    const meditationDates = new Set(recentMeditations.map(m => m.id)); // doc ID가 날짜(YYYY-MM-DD)
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (meditationDates.has(dateStr)) {
        count++;
      } else {
        break; 
      }
    }
    
    const alreadyClaimedToday = userProfile?.lastStreakClaimedAt === todayId;
    
    return { 
      count, 
      isEligible: count >= 7 && !alreadyClaimedToday 
    };
  }, [recentMeditations, userProfile, todayId]);

  const handleQuizSubmit = () => {
    if (selectedOption === null || !currentQuiz || userActivity) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuiz.correctIndex;

    setDocumentNonBlocking(userActivityRef!, {
      completedAt: new Date().toISOString(),
      isCorrect,
      selectedOption,
      rewarded: isCorrect ? 10 : 0,
      quizId: currentQuiz.id
    }, { merge: true });

    if (isCorrect) {
      const currentPoints = userProfile?.points || 0;
      const currentTotalPoints = userProfile?.totalPoints || 0;
      updateDocumentNonBlocking(userRef!, {
        points: currentPoints + 10,
        totalPoints: currentTotalPoints + 10
      });
      toast({ title: "정답입니다! 🎉", description: "10달란트가 적립되었습니다." });
    } else {
      toast({ title: "아쉬워요! 😢", description: "정답이 아니네요. 해설을 읽어보세요!" });
    }
  };

  const handleClaimStreakReward = () => {
    if (!streakInfo.isEligible || !userRef || isClaiming) return;

    setIsClaiming(true);
    const currentPoints = userProfile?.points || 0;
    const currentTotalPoints = userProfile?.totalPoints || 0;

    updateDocumentNonBlocking(userRef, {
      points: currentPoints + 50,
      totalPoints: currentTotalPoints + 50,
      lastStreakClaimedAt: todayId,
      updatedAt: new Date().toISOString()
    });

    toast({ 
      title: "챌린지 성공! 🏆", 
      description: "7일 연속 묵상 보상 50달란트가 지급되었습니다!",
    });
    setIsClaiming(false);
  };

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <h2 className="text-xl font-black text-gray-800 italic">오늘의 데일리 퀴즈</h2>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-gray-100">
          <CardContent className="p-8 space-y-6">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 relative">
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-300 animate-pulse" />
              <p className="text-lg font-black text-purple-900 leading-tight">
                {currentQuiz.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuiz.options.map((option: string, index: number) => {
                const isCompleted = !!userActivity || isSubmitted;
                const isCorrect = index === currentQuiz.correctIndex;
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
                disabled={selectedOption === null || isActivityLoading}
                className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 font-black text-lg shadow-lg shadow-purple-100"
              >
                {isActivityLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "정답 확인하고 10D 받기"}
              </Button>
            ) : (
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 space-y-2 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-black text-amber-700 uppercase tracking-wider">선생님의 해설</p>
                </div>
                <p className="text-[13px] font-bold text-amber-900 leading-relaxed">
                  {currentQuiz.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pb-10">
        <div className="flex items-center gap-2 px-1">
          <Trophy className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-black text-gray-800 italic">진행 중인 이벤트</h2>
        </div>
        
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white overflow-hidden relative">
          <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-20 animate-pulse" />
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-bold">연속 묵상 보너스</Badge>
                {streakInfo.count > 0 && (
                  <span className="text-xs font-black text-blue-200">현재 {streakInfo.count}일째! 🔥</span>
                )}
              </div>
              <h3 className="text-2xl font-black italic tracking-tight leading-tight">7일 연속 묵상 챌린지!</h3>
              <p className="text-[13px] font-bold text-blue-100 leading-relaxed">
                일주일 동안 하루도 빠짐없이 묵상을 완료하면<br/>특별 보너스 50달란트를 드려요!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={handleClaimStreakReward}
                disabled={!streakInfo.isEligible || isClaiming}
                className={cn(
                  "flex-1 h-14 rounded-2xl font-black text-lg shadow-lg transition-all",
                  streakInfo.isEligible 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-yellow-900/20" 
                    : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                )}
              >
                {isClaiming ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Gift className="w-5 h-5 mr-2" />
                    {userProfile?.lastStreakClaimedAt === todayId ? "오늘 완료!" : "보너스 50D 받기"}
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-blue-200">
                <span>Progress</span>
                <span>{Math.min(streakInfo.count, 7)} / 7 Days</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-1000" 
                  style={{ width: `${(Math.min(streakInfo.count, 7) / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", className)}>{children}</span>;
}
