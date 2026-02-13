"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const router = useRouter();
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
    if (!formData.email || !formData.password || !formData.name) {
      toast({ title: "입력 오류", description: "모든 필드를 채워주세요.", variant: "destructive" });
      return;
    }

    setLoading(true);
    // 실제 Firebase 연동 시 여기에 createUserWithEmailAndPassword와 Firestore 저장이 들어갑니다.
    try {
      setTimeout(() => {
        toast({ title: "환영합니다!", description: "회원가입이 완료되었습니다." });
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      toast({ title: "가입 실패", description: "다시 시도해주세요.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#E0E7FF] py-10">
      <div className="w-full max-w-[440px] px-6">
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-16 pb-12 px-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-[#C026D3]">
                예본TeenQT
              </h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">
                청소년부 매일 묵상
              </p>
            </div>

            {/* Form */}
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
                  placeholder="아이디 (이메일)" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="비밀번호" 
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
                {loading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-gray-300"
              >
                로그인하기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
