
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Heart,
  ChevronRight,
  Sparkles,
  BookOpen,
  ShoppingBag,
  User,
  Calendar
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RankingPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  // 누적 포인트(totalPoints) 기준 랭킹 산정을 위해 모든 사용자 가져오기
  // (특정 필드가 없는 사용자가 누락되는 것을 방지하기 위해 정렬 없이 가져옴)
  const rankingQuery = useMemoFirebase(() => query(
    collection(firestore, "users")
  ), [firestore]);

  const { data: rawUsers, isLoading } = useCollection(rankingQuery);

  // 메모리에서 정렬하여 상위 5명 추출
  const topUsers = useMemo(() => {
    if (!rawUsers) return null;
    return [...rawUsers]
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, 5);
  }, [rawUsers]);

  const roleLabels: Record<string, string> = {
    pastor: "교역자",
    teacher: "교사",
    grade7: "중1", grade8: "중2", grade9: "중3",
    grade10: "고1", grade11: "고2", grade12: "고3",
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8FAFC] min-h-screen pb-24 shadow-2xl overflow-hidden relative border-x border-gray-200 font-body">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#C026D3] tracking-tight italic">예본TeenQT</h1>
          <p className="text-gray-400 text-[13px] font-bold">환영합니다, {userProfile?.displayName || "친구"}님!</p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">
            {(userProfile?.points || 0).toLocaleString()} D
          </span>
        </div>
      </header>

      <div className="px-6 py-10 space-y-8 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <Badge className="bg-yellow-100 text-yellow-700 border-none font-black px-4 py-1 rounded-full mb-2">명예의 전당</Badge>
          <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight italic">달란트 랭킹 TOP 5</h2>
          <p className="text-gray-400 font-bold text-sm">
            달란트를 가장 많이 모은 상위 5명입니다!
          </p>
        </div>

        {/* Ranking List */}
        <div className="w-full space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Sparkles className="w-10 h-10 text-purple-200 animate-pulse" />
              <p className="text-gray-300 font-black italic">랭킹 산정 중...</p>
            </div>
          ) : (
            topUsers?.map((u, index) => (
              <RankingItem 
                key={u.id} 
                rank={index + 1} 
                user={u} 
                isMe={u.id === user?.uid} 
                roleLabel={roleLabels[u.role] || "멤버"}
              />
            ))
          )}
        </div>

        <p className="text-[11px] text-gray-300 font-bold text-center pt-4">
          누적 달란트는 매년 1월 1일에 초기화됩니다. 🚀
        </p>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t-2 border-blue-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group text-gray-400">
          <BookOpen className="w-6 h-6" />
          <span className="text-[11px] font-bold">QT</span>
        </Link>
        <div className="flex flex-col items-center gap-1 group text-gray-400">
          <Calendar className="w-6 h-6" />
          <span className="text-[11px] font-bold">이벤트</span>
        </div>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group">
          <Trophy className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400">
          <User className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}

function RankingItem({ rank, user, isMe, roleLabel }: { rank: number, user: any, isMe: boolean, roleLabel: string }) {
  const isTop3 = rank <= 3;
  
  const rankColors: Record<number, string> = {
    1: "bg-gradient-to-tr from-yellow-400 via-orange-300 to-yellow-500 border-yellow-200 ring-4 ring-yellow-100 shadow-yellow-100",
    2: "bg-gradient-to-tr from-slate-200 to-slate-400 border-slate-100 ring-4 ring-slate-50 shadow-slate-50",
    3: "bg-gradient-to-tr from-amber-400 to-amber-600 border-amber-200 ring-4 ring-amber-50 shadow-amber-50"
  };

  const rankIcons: Record<number, React.ReactNode> = {
    1: <div className="relative animate-bounce duration-1000"><Crown className="w-8 h-8 text-white fill-white" /></div>,
    2: <Medal className="w-7 h-7 text-white fill-white opacity-90" />,
    3: <Medal className="w-7 h-7 text-white fill-white opacity-80" />
  };

  return (
    <Card className={cn(
      "border-none rounded-[2rem] transition-all duration-500 overflow-hidden",
      rank === 1 ? "shadow-2xl scale-[1.02]" : "shadow-sm",
      isMe && rank !== 1 ? "ring-2 ring-purple-100" : ""
    )}>
      <CardContent className={cn(
        "p-5 flex items-center justify-between",
        rank === 1 ? "bg-white border-4 border-yellow-200" : "bg-white border-2 border-gray-50"
      )}>
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
            rankColors[rank] || "bg-gray-100 border-gray-50"
          )}>
            {rankIcons[rank] || <span className="font-black text-gray-400 text-lg">{rank}</span>}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className={cn(
              "w-12 h-12 border-2",
              rank === 1 ? "border-yellow-200" : "border-gray-100"
            )}>
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/200`} />
              <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[17px] text-gray-800 tracking-tight">{user.displayName}</span>
                {isMe && <Badge className="bg-orange-400 text-white border-none font-black text-[9px] px-1.5 h-4">나</Badge>}
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{roleLabel}</p>
            </div>
          </div>
        </div>

        {/* Points Display */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className={cn(
              "text-lg font-black italic tracking-tighter",
              rank === 1 ? "text-orange-500" : "text-gray-800"
            )}>
              {(user.totalPoints || 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-black text-gray-300 italic">D</span>
          </div>
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-[-2px]">Accumulated</p>
        </div>
      </CardContent>
    </Card>
  );
}
