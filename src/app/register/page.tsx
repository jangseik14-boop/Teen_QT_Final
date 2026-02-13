
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '', 
    role: '',
    gender: '',
    phone: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = formData.username.trim();

    if (!cleanUsername || !formData.password || !formData.name || !formData.role || !formData.gender) {
      toast({ title: "입력 오류", description: "모든 필수 필드를 채워주세요.", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "비밀번호 오류", description: "비밀번호는 최소 6자 이상이어야 합니다.", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    try {
      const q = query(collection(firestore, "users"), where("username", "==", cleanUsername));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast({ title: "중복된 아이디", description: "이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const randomId = Math.random().toString(36).substring(2, 10);
      const internalEmail = `user-${randomId}-${Date.now()}@yebon.teen`;

      const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      const currentYear = new Date().getFullYear();

      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        username: cleanUsername,
        displayName: formData.name,
        email: internalEmail,
        role: formData.role,
        gender: formData.gender,
        phone: formData.phone,
        points: 0,
        totalPoints: 0, // 누적 포인트 초기화
        lastResetYear: currentYear, // 초기 연도 설정
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({ title: "환영합니다! 🎉", description: "회원가입이 완료되었습니다. 묵상을 시작해봐요!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("가입 실패 상세:", error);
      let message = "회원가입 중 오류가 발생했습니다.";
      if (error.code === 'auth/email-already-in-use') message = "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      if (error.code === 'auth/invalid-email') message = "아이디 형식이 올바르지 않습니다.";
      
      toast({ title: "가입 실패", description: message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F0F7FF] via-[#E0F2FE] to-[#F0F7FF] py-10">
      <div className="w-full max-w-[440px] px-6">
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-16 pb-12 px-10 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-[#C026D3]">
                예본TeenQT
              </h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">
                청소년부 매일 묵상
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-gray-400 ml-1">이름</Label>
                <Input 
                  placeholder="실명을 입력하세요" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-gray-400 ml-1">아이디</Label>
                <Input 
                  placeholder="아이디를 입력하세요 (한글 가능)" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-gray-400 ml-1">비밀번호</Label>
                <Input 
                  type="password" 
                  placeholder="비밀번호 (6자 이상)" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-gray-400 ml-1">소속</Label>
                  <Select onValueChange={(val) => setFormData({...formData, role: val})}>
                    <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 text-gray-500">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="grade7">중1</SelectItem>
                      <SelectItem value="grade8">중2</SelectItem>
                      <SelectItem value="grade9">중3</SelectItem>
                      <SelectItem value="grade10">고1</SelectItem>
                      <SelectItem value="grade11">고2</SelectItem>
                      <SelectItem value="grade12">고3</SelectItem>
                      <SelectItem value="teacher">교사</SelectItem>
                      <SelectItem value="pastor">교역자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-gray-400 ml-1">성별</Label>
                  <Select onValueChange={(val) => setFormData({...formData, gender: val})}>
                    <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 text-gray-500">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-gray-400 ml-1">전화번호</Label>
                <Input 
                  placeholder="예: 01012345678" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 mt-4"
              >
                {loading ? "가입 진행 중..." : "회원가입 완료"}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-gray-300"
              >
                이미 계정이 있나요? 로그인하기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
