
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Crown, 
  Star, 
  Sparkles
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function RankingPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const rankingQuery = useMemoFirebase(() => query(
    collection(firestore, "users")
  ), [firestore]);

  const { data: rawUsers, isLoading } = useCollection(rankingQuery);

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
    <div className="px-6 py-10 space-y-8 flex flex-col items-center">
      <div className="text-center space-y-2">
        <Badge className="bg-yellow-100 text-yellow-700 border-none font-black px-4 py-1 rounded-full mb-2">명예의 전당</Badge>
        <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight italic">달란트 랭킹 TOP 5</h2>
        <p className="text-gray-400 font-bold text-sm">
          달란트를 가장 많이 모은 상위 5명입니다!
        </p>
      </div>

      <div className="w-full space-y-5">
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
  );
}

function RankingItem({ rank, user, isMe, roleLabel }: { rank: number, user: any, isMe: boolean, roleLabel: string }) {
  const rankColors: Record<number, string> = {
    1: "bg-gradient-to-tr from-yellow-400 via-yellow-200 to-yellow-600 border-yellow-300 ring-4 ring-yellow-100 shadow-xl shadow-yellow-200",
    2: "bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-400 border-slate-300 ring-4 ring-slate-100 shadow-md shadow-slate-100",
    3: "bg-gradient-to-tr from-[#92400E] via-[#78350F] to-[#451A03] border-[#78350F] ring-4 ring-orange-100/50 shadow-md shadow-orange-50"
  };

  const rankIcons: Record<number, React.ReactNode> = {
    1: (
      <div className="relative">
        <div className="absolute -inset-2 bg-yellow-400/30 blur-md rounded-full animate-pulse" />
        <div className="relative animate-bounce duration-1000">
          <Crown className="w-9 h-9 text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-100 animate-pulse" />
      </div>
    ),
    2: <Crown className="w-7 h-7 text-white fill-white opacity-95" />,
    3: <Crown className="w-7 h-7 text-orange-200 fill-orange-200 opacity-90" />
  };

  const cardClasses = rank === 1 
    ? "border-4 border-yellow-400/50 shadow-[0_20px_50px_rgba(255,223,0,0.2)] scale-[1.05] ring-4 ring-yellow-200/20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 z-10" 
    : rank === 2 
    ? "border-2 border-slate-300 shadow-lg ring-2 ring-slate-100 bg-white" 
    : rank === 3 
    ? "border-2 border-[#92400E] shadow-md ring-2 ring-orange-100/50 bg-white" 
    : "border-2 border-gray-50 shadow-sm bg-white";

  return (
    <Card className={cn(
      "border-none rounded-[2.5rem] transition-all duration-500 overflow-hidden relative",
      cardClasses,
      isMe && rank > 3 ? "ring-2 ring-purple-100" : ""
    )}>
      {rank === 1 && (
        <div className="absolute top-0 right-0 p-3">
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none font-black italic tracking-tighter animate-pulse shadow-sm">CHAMPION</Badge>
        </div>
      )}
      
      <CardContent className={cn(
        "p-5 flex items-center justify-between transition-all",
        rank === 1 ? "py-7" : ""
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform",
            rankColors[rank] || "bg-gray-100 border-gray-50",
            rank === 1 ? "scale-110" : ""
          )}>
            {rankIcons[rank] || <span className="font-black text-gray-400 text-xl">{rank}</span>}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className={cn(
                "w-12 h-12 border-2",
                rank === 1 ? "w-14 h-14 border-yellow-400 ring-2 ring-yellow-100" : rank === 2 ? "border-slate-300" : rank === 3 ? "border-orange-300" : "border-gray-100"
              )}>
                <AvatarImage src={user.profilePictureUrl || `https://picsum.photos/seed/${user.id}/200`} />
                <AvatarFallback className="font-black text-lg bg-gray-50">{user.displayName?.[0]}</AvatarFallback>
              </Avatar>
              {rank === 1 && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "font-black tracking-tight",
                  rank === 1 ? "text-xl text-yellow-900" : "text-[17px] text-gray-800"
                )}>
                  {user.displayName}
                </span>
                {isMe && <Badge className="bg-orange-400 text-white border-none font-black text-[9px] px-1.5 h-4">나</Badge>}
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{roleLabel}</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <span className={cn(
              "font-black italic tracking-tighter",
              rank === 1 ? "text-2xl text-orange-600" : rank === 2 ? "text-xl text-slate-600" : rank === 3 ? "text-xl text-[#92400E]" : "text-lg text-gray-800"
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
