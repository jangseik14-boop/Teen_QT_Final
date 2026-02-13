
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !firestore) {
      toast({ title: "시스템 오류", description: "Firebase 설정이 완료되지 않았습니다.", variant: "destructive" });
      return;
    }

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      toast({ title: "로그인 오류", description: "아이디와 비밀번호를 입력해주세요.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(firestore, "users"), where("username", "==", cleanUsername));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ title: "로그인 실패", description: "존재하지 않는 아이디입니다.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const internalEmail = userData.email;

      await signInWithEmailAndPassword(auth, internalEmail, password);
      toast({ title: "로그인 성공", description: "반가워요! 오늘의 말씀을 묵상해볼까요?" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("로그인 실패:", error);
      let message = "아이디 또는 비밀번호를 확인해주세요.";
      if (error.code === 'auth/wrong-password') message = "비밀번호가 일치하지 않습니다.";
      if (error.code === 'auth/invalid-credential') message = "로그인 정보가 올바르지 않습니다.";
      
      toast({ title: "로그인 실패", description: message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#E0E7FF]">
      <div className="w-full max-w-[440px] px-6">
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-16 pb-12 px-10 space-y-10">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-[#C026D3]">
                예본TeenQT
              </h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide">
                청소년부 매일 묵상
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-bold text-gray-400 ml-1">아이디</Label>
                <Input 
                  id="username"
                  type="text" 
                  placeholder="아이디를 입력하세요" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20 placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-gray-400 ml-1">비밀번호</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="비밀번호를 입력하세요" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20 placeholder:text-gray-300"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-[#C026D3] data-[state=checked]:border-[#C026D3]" />
                <Label 
                  htmlFor="remember" 
                  className="text-[13px] font-medium text-gray-500 cursor-pointer select-none"
                >
                  로그인 상태 유지
                </Label>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-90 transition-opacity shadow-lg shadow-purple-200 mt-4"
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/register" 
                className="text-sm font-medium text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-gray-300"
              >
                처음이신가요? 회원가입하기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
