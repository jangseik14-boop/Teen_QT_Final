
"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Zap, 
  Trophy, 
  ShoppingBag, 
  User as UserIcon,
  Star,
  Heart
} from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  const getHeaderInfo = () => {
    if (pathname === '/dashboard/activity') return { title: "예본Teen활동", sub: "매일매일 즐거운 신앙 루틴!" };
    if (pathname === '/dashboard/ranking') return { title: "예본TeenQT", sub: "명예의 전당 랭킹" };
    if (pathname === '/dashboard/quiz') return { title: "예본TeenQT", sub: "즐거운 달란트 상점" };
    if (pathname === '/dashboard/my') return { title: "예본TeenQT", sub: `환영합니다, ${userProfile?.displayName || '친구'}님!` };
    return { title: "예본TeenQT", sub: `반가워요, ${userProfile?.displayName || '친구'}님!` };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#F0F7FF] max-w-md mx-auto shadow-2xl relative border-x border-blue-100 flex flex-col font-body">
      {/* Shared Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-2 border-blue-100 shadow-sm shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight italic">{headerInfo.title}</h1>
          <p className="text-gray-500 text-xs font-bold flex items-center gap-1">
             {pathname === '/dashboard' && <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />}
             {headerInfo.sub}
          </p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border-2 border-yellow-300">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">
            {(userProfile?.points || 0).toLocaleString()} D
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {children}
      </main>

      {/* Shared Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t-2 border-blue-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className={cn("flex flex-col items-center gap-1 group", pathname === '/dashboard' ? "text-[#C026D3]" : "text-gray-400")}>
          <BookOpen className={cn("w-6 h-6", pathname === '/dashboard' && "fill-[#C026D3]/20")} />
          <span className={cn("text-[11px]", pathname === '/dashboard' ? "font-black" : "font-bold")}>QT</span>
        </Link>
        <Link href="/dashboard/activity" className={cn("flex flex-col items-center gap-1 group", pathname === '/dashboard/activity' ? "text-[#C026D3]" : "text-gray-400")}>
          <Zap className={cn("w-6 h-6", pathname === '/dashboard/activity' && "fill-[#C026D3]")} />
          <span className={cn("text-[11px]", pathname === '/dashboard/activity' ? "font-black" : "font-bold")}>활동</span>
        </Link>
        <Link href="/dashboard/ranking" className={cn("flex flex-col items-center gap-1 group", pathname === '/dashboard/ranking' ? "text-[#C026D3]" : "text-gray-400")}>
          <Trophy className={cn("w-6 h-6", pathname === '/dashboard/ranking' && "fill-[#C026D3]/20")} />
          <span className={cn("text-[11px]", pathname === '/dashboard/ranking' ? "font-black" : "font-bold")}>랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className={cn("flex flex-col items-center gap-1 group", pathname === '/dashboard/quiz' ? "text-[#C026D3]" : "text-gray-400")}>
          <ShoppingBag className={cn("w-6 h-6", pathname === '/dashboard/quiz' && "fill-[#C026D3]/20")} />
          <span className={cn("text-[11px]", pathname === '/dashboard/quiz' ? "font-black" : "font-bold")}>상점</span>
        </Link>
        <Link href="/dashboard/my" className={cn("flex flex-col items-center gap-1 group", pathname === '/dashboard/my' ? "text-[#C026D3]" : "text-gray-400")}>
          <UserIcon className={cn("w-6 h-6", pathname === '/dashboard/my' && "fill-[#C026D3]/20")} />
          <span className={cn("text-[11px]", pathname === '/dashboard/my' ? "font-black" : "font-bold")}>MY</span>
        </Link>
      </nav>
    </div>
  );
}
