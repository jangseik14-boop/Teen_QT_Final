
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ShoppingBag, 
  Star, 
  Gift, 
  Coffee, 
  Ticket, 
  UtensilsCrossed, 
  Home,
  Trophy
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";

const SHOP_ITEMS = [
  { id: "olv", name: "올리브영 5,000원권", category: "뷰티", price: 500, icon: <Sparkles className="w-6 h-6 text-emerald-400" /> },
  { id: "cvs", name: "편의점 5,000원권", category: "편의점", price: 500, icon: <Gift className="w-6 h-6 text-purple-400" /> },
  { id: "cafe", name: "카페 5,000원권", category: "카페", price: 500, icon: <Coffee className="w-6 h-6 text-amber-600" /> },
  { id: "baemin", name: "배달의민족 5,000원권", category: "배달", price: 500, icon: <Ticket className="w-6 h-6 text-cyan-400" /> },
  { id: "momstouch", name: "맘스터치 5,000원권", category: "푸드", price: 500, icon: <UtensilsCrossed className="w-6 h-6 text-orange-400" /> },
  { id: "daiso", name: "다이소 5,000원권", category: "생활", price: 500, icon: <Home className="w-6 h-6 text-rose-400" /> },
];

export default function VibeQuizShop() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isBuying, setIsBuying] = useState<string | null>(null);

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  const handleBuy = async (item: typeof SHOP_ITEMS[0]) => {
    if (!user || !userProfile) {
      toast({ title: "로그인 필요", description: "로그인 후 이용 가능합니다.", variant: "destructive" });
      return;
    }

    if ((userProfile.points || 0) < item.price) {
      toast({ title: "달란트 부족", description: "달란트가 부족합니다. 묵상을 더 열심히 해볼까요?", variant: "destructive" });
      return;
    }

    setIsBuying(item.id);
    try {
      updateDocumentNonBlocking(userRef!, {
        points: (userProfile.points || 0) - item.price,
        updatedAt: new Date().toISOString()
      });

      const inventoryRef = collection(firestore, `users/${user.uid}/inventory`);
      await addDocumentNonBlocking(inventoryRef, {
        itemId: item.id,
        name: item.name,
        price: item.price,
        status: 'available',
        createdAt: new Date().toISOString()
      });

      toast({ 
        title: "구매 완료! 🛍️", 
        description: `"${item.name}"이(가) 보관함에 추가되었습니다.`,
      });
    } catch (error) {
      console.error("구매 실패:", error);
      toast({ title: "오류 발생", description: "구매 처리 중 문제가 발생했습니다.", variant: "destructive" });
    } finally {
      setIsBuying(null);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-2xl overflow-hidden relative font-body">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white sticky top-0 z-40">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#C026D3] tracking-tight italic">예본TeenQT</h1>
          <p className="text-gray-400 text-[13px] font-medium">환영합니다, {userProfile?.displayName || "친구"}님!</p>
        </div>
        <div className="bg-[#FEF9C3] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-yellow-200">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">{(userProfile?.points || 0).toLocaleString()} D</span>
        </div>
      </header>

      <div className="px-6 space-y-6 pt-2">
        {/* 보유 달란트 배너 */}
        <div className="bg-gradient-to-br from-[#A855F7] to-[#8B5CF6] rounded-[2rem] p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
          <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
          <div className="space-y-1 relative z-10">
            <p className="text-white/80 font-bold text-sm">보유 달란트</p>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              <h2 className="text-4xl font-black tracking-tighter">{(userProfile?.points || 0).toLocaleString()}</h2>
            </div>
          </div>
          {/* 누적 달란트 표시 */}
          <div className="pt-2 border-t border-white/20 flex items-center gap-2 relative z-10">
            <Trophy className="w-3 h-3 text-yellow-200" />
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
              누적 달란트: <span className="text-white">{(userProfile?.totalPoints || 0).toLocaleString()} D</span>
            </p>
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          {SHOP_ITEMS.map(item => (
            <Card key={item.id} className="border-2 border-cyan-100 bg-[#F0FDFA] rounded-[2rem] overflow-hidden shadow-none hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-cyan-50">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-cyan-500 uppercase tracking-tighter">{item.category}</p>
                  <h3 className="text-sm font-black text-gray-800 leading-tight break-keep px-1">
                    {item.name}
                  </h3>
                </div>
                <Button 
                  onClick={() => handleBuy(item)}
                  disabled={isBuying === item.id}
                  className="w-full rounded-xl bg-white hover:bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-sm font-black text-xs h-10 transition-all active:scale-95"
                >
                  {isBuying === item.id ? "..." : `${item.price.toLocaleString()} D 구매`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t-2 border-blue-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group text-gray-400">
          <Star className="w-6 h-6" />
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
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group">
          <ShoppingBag className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}

// Next.js Link 컴포넌트 사용을 위한 간단한 처리
import Link from "next/link";
