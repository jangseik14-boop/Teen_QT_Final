
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    gender: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      toast({ title: "입력 오류", description: "모든 필수 필드를 채워주세요.", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "비밀번호 오류", description: "비밀번호는 최소 6자 이상이어야 합니다.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. 프로필 이름 업데이트
      await updateProfile(user, { displayName: formData.name });

      // 3. Firestore에 사용자 상세 프로필 저장
      // Auth 생성 직후 세션이 잡히므로 rules의 isOwner 조건 충족 가능
      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        displayName: formData.name,
        email: formData.email,
        role: formData.role,
        gender: formData.gender,
        phone: formData.phone,
        points: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast({ title: "환영합니다! 🎉", description: "회원가입이 완료되었습니다. 묵상을 시작해봐요!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("가입 실패 상세:", error);
      let message = "회원가입 중 오류가 발생했습니다.";
      
      // 구체적인 에러 메시지 처리
      if (error.code === 'auth/email-already-in-use') message = "이미 가입된 이메일입니다.";
      if (error.code === 'auth/invalid-email') message = "이메일 형식이 올바르지 않습니다.";
      if (error.code === 'auth/operation-not-allowed') message = "Firebase에서 이메일 로그인이 비활성화되어 있습니다. 관리자에게 문의하세요.";
      if (error.code === 'permission-denied') message = "데이터 저장 권한이 없습니다. 잠시 후 다시 시도해주세요.";
      
      toast({ title: "가입 실패", description: message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#E0E7FF] py-10">
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
              <div className="space-y-2">
                <Input 
                  placeholder="이름" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Select onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 text-gray-500">
                    <SelectValue placeholder="소속 (학년/직분) 선택" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="grade7">중학교 1학년</SelectItem>
                    <SelectItem value="grade8">중학교 2학년</SelectItem>
                    <SelectItem value="grade9">중학교 3학년</SelectItem>
                    <SelectItem value="grade10">고등학교 1학년</SelectItem>
                    <SelectItem value="grade11">고등학교 2학년</SelectItem>
                    <SelectItem value="grade12">고등학교 3학년</SelectItem>
                    <SelectItem value="teacher">교사</SelectItem>
                    <SelectItem value="pastor">교역자</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={(val) => setFormData({...formData, gender: val})}>
                  <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 text-gray-500">
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Input 
                  placeholder="전화번호 (예: 010-1234-5678)" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Input 
                  placeholder="이메일 주소" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="비밀번호 (6자 이상)" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
