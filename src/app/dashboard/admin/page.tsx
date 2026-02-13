
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Trophy, 
  ArrowLeft, 
  TrendingUp, 
  MessageSquare,
  Search,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // 사용자 리스트 가져오기 (포인트 높은 순)
  const usersQuery = useMemoFirebase(() => query(
    collection(firestore, "users"),
    orderBy("points", "desc"),
    limit(10)
  ), [firestore]);

  const { data: topUsers, isLoading } = useCollection(usersQuery);

  return (
    <div className="max-w-md mx-auto bg-[#F8FAFC] min-h-screen pb-24 shadow-2xl overflow-hidden relative border-x border-gray-200 font-body">
      <header className="px-6 pt-8 pb-4 flex items-center gap-4 bg-white border-b sticky top-0 z-40">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/dashboard/my">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-black text-gray-800 italic">관리자 대시보드</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* 통계 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="p-4 space-y-1">
              <Users className="w-5 h-5 text-blue-500 mb-1" />
              <p className="text-xs font-bold text-blue-600">전체 학생</p>
              <p className="text-xl font-black text-blue-900">128명</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-purple-50">
            <CardContent className="p-4 space-y-1">
              <TrendingUp className="w-5 h-5 text-purple-500 mb-1" />
              <p className="text-xs font-bold text-purple-600">오늘 참여</p>
              <p className="text-xl font-black text-purple-900">42명</p>
            </CardContent>
          </Card>
        </div>

        {/* 학생 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="학생 이름 검색..." 
            className="pl-10 h-12 bg-white rounded-2xl border-gray-200 focus-visible:ring-purple-400"
          />
        </div>

        {/* 상위 학생 랭킹 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-black text-lg text-gray-800">이달의 포인트 랭킹</h3>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="p-10 text-center animate-pulse text-gray-400 font-bold">로딩 중...</div>
            ) : topUsers?.map((user, idx) => (
              <Card key={user.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-black text-sm text-gray-800">{user.displayName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{user.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-yellow-200 text-yellow-700 font-black">
                    {user.points?.toLocaleString()} D
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 묵상 현황 리스트 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <h3 className="font-black text-lg text-gray-800">최근 묵상 기록</h3>
          </div>
          <Card className="border-none shadow-sm rounded-2xl bg-white p-4">
             <div className="text-center py-6 space-y-2">
                <Calendar className="w-10 h-10 text-gray-200 mx-auto" />
                <p className="text-sm font-bold text-gray-400">조회할 데이터가 없습니다.</p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
