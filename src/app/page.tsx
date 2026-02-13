
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#E0E7FF]">
      <div className="w-full max-w-[440px] px-6">
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-16 pb-12 px-10 space-y-10">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="아이디" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20 placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="비밀번호" 
                  className="h-14 bg-[#F8FAFC] border-[#F1F5F9] rounded-2xl px-6 focus-visible:ring-[#C026D3]/20 placeholder:text-gray-300"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]" />
                <Label 
                  htmlFor="remember" 
                  className="text-[13px] font-medium text-gray-500 cursor-pointer select-none"
                >
                  로그인 상태 유지
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <Button 
                asChild
                className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-90 transition-opacity shadow-lg shadow-purple-200"
              >
                <Link href="/dashboard">로그인</Link>
              </Button>
              
              <div className="text-center">
                <Link 
                  href="/register" 
                  className="text-sm font-medium text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-gray-300"
                >
                  회원가입하기
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
