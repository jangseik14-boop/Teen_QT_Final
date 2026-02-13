
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  LogOut, 
  Camera, 
  ChevronDown, 
  Gift, 
  ShoppingBag, 
  CreditCard,
  Settings,
  ShieldCheck
} from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function MyProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const roleLabels: Record<string, string> = {
    pastor: "예본TeenQT 교역자",
    teacher: "예본TeenQT 교사",
    grade7: "중학교 1학년",
    grade8: "중학교 2학년",
    grade9: "중학교 3학년",
    grade10: "고등학교 1학년",
    grade11: "고등학교 2학년",
    grade12: "고등학교 3학년",
  };

  const isAdmin = userProfile?.role === 'pastor' || userProfile?.role === 'teacher';

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-2xl overflow-hidden relative font-body">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#C026D3] tracking-tight italic">예본TeenQT</h1>
          <p className="text-gray-400 text-[13px] font-medium">환영합니다, {userProfile?.displayName || "사용자"}님!</p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">
            {(userProfile?.points || 0).toLocaleString()} D
          </span>
        </div>
      </header>

      <div className="px-6 space-y-8 pt-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-purple-500 shadow-xl">
              <Avatar className="w-full h-full border-4 border-white">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200`} />
                <AvatarFallback>{userProfile?.displayName?.[0]}</AvatarFallback>
              </Avatar>
            </div>
            <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 hover:scale-110 transition-transform">
              <Camera className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{userProfile?.displayName || "이름 없음"}</h2>
            <p className="text-gray-400 font-bold text-sm">{roleLabels[userProfile?.role || ""] || "일반 멤버"}</p>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 mx-auto text-gray-300 hover:text-gray-500 transition-colors pt-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[13px] font-bold tracking-tight">로그아웃</span>
            </button>
          </div>

          {isAdmin && (
            <Button asChild variant="outline" className="rounded-full border-[#C026D3] text-[#C026D3] hover:bg-[#C026D3]/10 font-black h-10 px-6 mt-2">
              <Link href="/dashboard/admin">
                <ShieldCheck className="w-4 h-4 mr-2" />
                관리자 모드
              </Link>
            </Button>
          )}
        </div>

        {/* 내 보관함 Section */}
        <div className="space-y-4">
          <div className="bg-[#FDF4FF] rounded-[2.5rem] p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-lg text-[#701A75] italic">내 보관함</h3>
              <Badge className="bg-[#FAE8FF] text-[#C026D3] border-none font-bold">사용 가능 3개</Badge>
            </div>

            <div className="space-y-3">
              <StorageItem 
                icon={<CreditCard className="text-emerald-500" />}
                title="올리브영 5,000원권"
                status="교환 가능"
              />
              <StorageItem 
                icon={<ShoppingBag className="text-rose-500" />}
                title="다이소 5,000원권"
                status="교환 가능"
              />
              <StorageItem 
                icon={<Star className="text-blue-500" />}
                title="에어팟4 노이즈 캔슬링"
                status="교환 가능"
              />
            </div>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 text-gray-400 font-bold text-sm py-4">
          사용 완료 내역 보기 <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Nav (Consistent with Dashboard) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t-2 border-blue-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group text-gray-400">
          <CreditCard className="w-6 h-6" />
          <span className="text-[11px] font-bold">QT</span>
        </Link>
        <div className="flex flex-col items-center gap-1 group text-gray-400">
          <Gift className="w-6 h-6" />
          <span className="text-[11px] font-bold">이벤트</span>
        </div>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400">
          <Star className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group">
          <ShieldCheck className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">MY</span>
        </Link>
      </nav>
    </div>
  );
}

function StorageItem({ icon, title, status }: { icon: React.ReactNode, title: string, status: string }) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white group hover:scale-[1.01] transition-transform">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-gray-100 transition-colors">
            {icon}
          </div>
          <div>
            <p className="font-black text-[15px] text-gray-800">{title}</p>
            <p className="text-gray-400 text-xs font-bold">{status}</p>
          </div>
        </div>
        <Button className="rounded-xl bg-[#FDF4FF] text-[#C026D3] hover:bg-[#FAE8FF] font-black h-9 px-4 text-xs border border-pink-100 shadow-sm">
          교환하기
        </Button>
      </CardContent>
    </Card>
  );
}
