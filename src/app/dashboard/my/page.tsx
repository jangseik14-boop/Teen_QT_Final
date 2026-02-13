
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  LogOut, 
  Camera, 
  ChevronDown, 
  ChevronUp,
  Gift, 
  ShoppingBag, 
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  PackageOpen
} from "lucide-react";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc, collection, query, where, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function MyProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  // 쿠폰 교환용 다이얼로그 상태
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 관리자 모드 진입용 다이얼로그 상태
  const [isAdminEntryDialogOpen, setIsAdminEntryDialogOpen] = useState(false);
  const [entryPassword, setEntryPassword] = useState("");

  const [showUsedHistory, setShowUsedHistory] = useState(false);

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  // 보관함 아이템 가져오기
  const inventoryQuery = useMemoFirebase(() => user ? query(
    collection(firestore, `users/${user.uid}/inventory`),
    orderBy("createdAt", "desc")
  ) : null, [user, firestore]);
  const { data: inventoryItems } = useCollection(inventoryQuery);

  const availableItems = inventoryItems?.filter(item => item.status === 'available') || [];
  const usedItems = inventoryItems?.filter(item => item.status === 'used') || [];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleRedeemClick = (item: any) => {
    setSelectedItem(item);
    setIsAdminDialogOpen(true);
  };

  // 쿠폰 교환용 비밀번호 확인
  const handleAdminAuth = () => {
    if (adminPassword === "141414") {
      if (user && selectedItem) {
        const itemRef = doc(firestore, `users/${user.uid}/inventory`, selectedItem.id);
        updateDocumentNonBlocking(itemRef, {
          status: 'used',
          usedAt: new Date().toISOString()
        });
        toast({ title: "교환 완료! 🎁", description: "상품 교환이 정상적으로 처리되었습니다." });
        setIsAdminDialogOpen(false);
        setAdminPassword("");
        setSelectedItem(null);
      }
    } else {
      toast({ title: "비밀번호 오류", description: "관리자 비밀번호가 일치하지 않습니다.", variant: "destructive" });
    }
  };

  // 관리자 모드 진입용 비밀번호 확인
  const handleAdminEntryAuth = () => {
    if (entryPassword === "141414") {
      router.push("/dashboard/admin");
      setIsAdminEntryDialogOpen(false);
      setEntryPassword("");
    } else {
      toast({ title: "비밀번호 오류", description: "관리자 비밀번호가 일치하지 않습니다.", variant: "destructive" });
    }
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

  const canSeeAdminMode = userProfile?.role === 'pastor' || userProfile?.role === 'teacher';

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

          {canSeeAdminMode && (
            <button onClick={() => setIsAdminEntryDialogOpen(true)} className="w-full text-left">
              <div className="w-full flex items-center justify-between p-5 bg-rose-50 border-2 border-rose-100 rounded-[1.5rem] group hover:bg-rose-100 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="font-black text-rose-600">관리자 모드</span>
                </div>
                <ChevronDown className="w-5 h-5 text-rose-300 -rotate-90" />
              </div>
            </button>
          )}
        </div>

        {/* 내 보관함 Section */}
        <div className="space-y-4">
          <div className="bg-[#FDF4FF] rounded-[2.5rem] p-6 space-y-4 shadow-sm border-2 border-pink-50">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-lg text-[#701A75] italic">내 보관함</h3>
              <Badge className="bg-[#FAE8FF] text-[#C026D3] border-none font-bold">
                사용 가능 {availableItems.length}개
              </Badge>
            </div>

            <div className="space-y-3 min-h-[100px]">
              {availableItems.length > 0 ? availableItems.map((item: any) => (
                <Card key={item.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white group hover:scale-[1.01] transition-transform">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-pink-50 p-3 rounded-2xl">
                        <Gift className="text-pink-500 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-[15px] text-gray-800">{item.name}</p>
                        <p className="text-gray-400 text-xs font-bold">교환 가능</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleRedeemClick(item)}
                      className="rounded-xl bg-[#FDF4FF] text-[#C026D3] hover:bg-[#FAE8FF] font-black h-9 px-4 text-xs border border-pink-100 shadow-sm"
                    >
                      교환하기
                    </Button>
                  </CardContent>
                </Card>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                  <PackageOpen className="w-10 h-10 mb-2 text-pink-300" />
                  <p className="text-sm font-bold text-pink-400">보관함이 비어있어요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 사용 완료 내역 */}
        <div className="space-y-2">
          <button 
            onClick={() => setShowUsedHistory(!showUsedHistory)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 font-bold text-sm py-2 hover:text-gray-600 transition-colors"
          >
            사용 완료 내역 보기 {showUsedHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showUsedHistory && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              {usedItems.length > 0 ? usedItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl opacity-60">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-bold text-gray-600 line-through">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{new Date(item.usedAt).toLocaleDateString()} 사용됨</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-gray-400 text-[10px]">교환완료</Badge>
                </div>
              )) : (
                <p className="text-center py-4 text-xs font-bold text-gray-300">내역이 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 쿠폰 교환 확인 다이얼로그 */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-[320px] p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-rose-500" />
            </div>
            <DialogTitle className="text-xl font-black text-center text-gray-800 tracking-tight italic">교환 확인</DialogTitle>
            <DialogDescription className="text-center text-gray-400 font-bold text-sm leading-relaxed">
              선생님께 이 화면을 보여드리고<br/>비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password"
              placeholder="비밀번호"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="h-14 bg-gray-50 border-none rounded-2xl text-center text-2xl tracking-[1em] font-black focus-visible:ring-rose-400"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAdminAuth}
              className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 font-black text-lg shadow-lg shadow-rose-100"
            >
              교환 완료하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 관리자 모드 진입 확인 다이얼로그 */}
      <Dialog open={isAdminEntryDialogOpen} onOpenChange={setIsAdminEntryDialogOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-[320px] p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <DialogTitle className="text-xl font-black text-center text-gray-800 tracking-tight italic">관리자 인증</DialogTitle>
            <DialogDescription className="text-center text-gray-400 font-bold text-sm leading-relaxed">
              관리자 모드에 진입하기 위해<br/>비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password"
              placeholder="비밀번호"
              value={entryPassword}
              onChange={(e) => setEntryPassword(e.target.value)}
              className="h-14 bg-gray-50 border-none rounded-2xl text-center text-2xl tracking-[1em] font-black focus-visible:ring-blue-400"
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAdminEntryAuth}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-lg shadow-blue-100"
            >
              인증 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Nav */}
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
          <User className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">MY</span>
        </Link>
      </nav>
    </div>
  );
}

function User({ className, ...props }: any) {
  return (
    <div className={className}>
      <Avatar className="w-6 h-6">
        <AvatarImage src={`https://picsum.photos/seed/user/200`} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
}
