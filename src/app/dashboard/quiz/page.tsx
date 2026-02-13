
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Trophy, Zap, Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";

const SHOP_ITEMS = [
  { id: "s1", name: "올리브영 5,000원권", price: 5000, desc: "노트북 꾸미기 필수템", badge: "Hit" },
  { id: "s2", name: "다이소 5,000원권", price: 5000, desc: "실속있는 쇼핑 아이템", badge: "New" },
  { id: "s3", name: "에어팟4 노이즈 캔슬링", price: 250000, desc: "최고의 갓생 선물", badge: "Flex" }
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
      // 1. 포인트 차감
      updateDocumentNonBlocking(userRef!, {
        points: (userProfile.points || 0) - item.price,
        updatedAt: new Date().toISOString()
      });

      // 2. 보관함에 추가
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
    <div className="max-w-md mx-auto bg-[#F0F7FF] min-h-screen pb-24 shadow-2xl overflow-hidden relative border-x border-blue-200 font-body">
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-2 border-blue-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight italic">틴이벤트 상점</h1>
          <p className="text-gray-500 text-xs font-bold">포인트를 플렉스 하세요!</p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border-2 border-yellow-300">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700">{(userProfile?.points || 0).toLocaleString()} D</span>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
          <Zap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
          <Badge className="bg-white/20 text-white border-none font-black px-4 py-1 uppercase tracking-widest text-[10px]">Special Event</Badge>
          <h2 className="text-3xl font-black tracking-tighter italic">Vibe Shop Open!</h2>
          <p className="text-white/80 font-bold text-sm leading-relaxed">묵상으로 모은 달란트를<br/>멋진 상품으로 교환해보세요.</p>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="font-black text-xl text-gray-800 flex items-center gap-2 px-1">
            <ShoppingBag className="text-purple-500" /> 전체 상품 리스트
          </h3>
          
          <div className="space-y-4">
            {SHOP_ITEMS.map(item => (
              <Card key={item.id} className="group overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md transition-all rounded-[2.5rem] bg-white">
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <CardTitle className="text-xl font-black italic text-gray-800">{item.name}</CardTitle>
                    {item.badge && <Badge className="bg-rose-500 text-white border-none font-black text-[10px] px-3">{item.badge}</Badge>}
                  </div>
                  <CardDescription className="font-bold text-gray-400">{item.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <div className="font-black text-2xl text-purple-600 italic">{item.price.toLocaleString()} D</div>
                  <Button 
                    onClick={() => handleBuy(item)}
                    disabled={isBuying === item.id}
                    className="rounded-2xl px-8 bg-black hover:bg-gray-800 shadow-lg font-black transition-all active:scale-95"
                  >
                    {isBuying === item.id ? "구매중..." : "구매하기"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
