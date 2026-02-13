
"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Trophy, 
  ArrowLeft, 
  TrendingUp, 
  MessageSquare,
  Search,
  Calendar,
  UserCheck,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // 모든 사용자 가져오기
  const usersQuery = useMemoFirebase(() => query(
    collection(firestore, "users"),
    orderBy("points", "desc")
  ), [firestore]);

  const { data: allUsers, isLoading } = useCollection(usersQuery);

  // 명단 구분 로직
  const segmentedUsers = useMemo(() => {
    if (!allUsers) return { middleMale: [], middleFemale: [], highMale: [], highFemale: [], others: [] };

    const segments: any = {
      middleMale: [],
      middleFemale: [],
      highMale: [],
      highFemale: [],
      others: []
    };

    allUsers.forEach(user => {
      const isMiddle = ['grade7', 'grade8', 'grade9'].includes(user.role);
      const isHigh = ['grade10', 'grade11', 'grade12'].includes(user.role);
      
      if (isMiddle && user.gender === 'male') segments.middleMale.push(user);
      else if (isMiddle && user.gender === 'female') segments.middleFemale.push(user);
      else if (isHigh && user.gender === 'male') segments.highMale.push(user);
      else if (isHigh && user.gender === 'female') segments.highFemale.push(user);
      else segments.others.push(user);
    });

    return segments;
  }, [allUsers]);

  return (
    <div className="max-w-md mx-auto bg-[#F8FAFC] min-h-screen pb-24 shadow-2xl overflow-hidden relative border-x border-gray-200 font-body">
      <header className="px-6 pt-8 pb-4 flex items-center gap-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/dashboard/my">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-black text-gray-800 italic">관리자 대시보드</h1>
      </header>

      <div className="p-6 space-y-8">
        {/* 통계 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-blue-50 rounded-[1.5rem]">
            <CardContent className="p-4 space-y-1">
              <Users className="w-5 h-5 text-blue-500 mb-1" />
              <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">전체 회원</p>
              <p className="text-2xl font-black text-blue-900">{allUsers?.length || 0}명</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-purple-50 rounded-[1.5rem]">
            <CardContent className="p-4 space-y-1">
              <TrendingUp className="w-5 h-5 text-purple-500 mb-1" />
              <p className="text-xs font-bold text-purple-600 uppercase tracking-tighter">포인트 TOP</p>
              <p className="text-2xl font-black text-purple-900">{allUsers?.[0]?.displayName || "-"}</p>
            </CardContent>
          </Card>
        </div>

        {/* 명단 관리 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <GraduationCap className="w-5 h-5 text-gray-800" />
            <h3 className="font-black text-lg text-gray-800 italic">회원 그룹 명단</h3>
          </div>

          <Tabs defaultValue="middle" className="w-full">
            <TabsList className="w-full bg-white border-2 border-gray-100 p-1 rounded-2xl h-12">
              <TabsTrigger value="middle" className="flex-1 rounded-xl font-bold data-[state=active]:bg-gray-100">중등부</TabsTrigger>
              <TabsTrigger value="high" className="flex-1 rounded-xl font-bold data-[state=active]:bg-gray-100">고등부</TabsTrigger>
              <TabsTrigger value="others" className="flex-1 rounded-xl font-bold data-[state=active]:bg-gray-100">기타</TabsTrigger>
            </TabsList>

            <TabsContent value="middle" className="space-y-6 pt-4">
              <UserSegment title="중남 (중등부 남자)" users={segmentedUsers.middleMale} color="blue" />
              <UserSegment title="중여 (중등부 여자)" users={segmentedUsers.middleFemale} color="pink" />
            </TabsContent>

            <TabsContent value="high" className="space-y-6 pt-4">
              <UserSegment title="고남 (고등부 남자)" users={segmentedUsers.highMale} color="indigo" />
              <UserSegment title="고여 (고등부 여자)" users={segmentedUsers.highFemale} color="rose" />
            </TabsContent>

            <TabsContent value="others" className="pt-4">
              <UserSegment title="기타 (교사/교역자)" users={segmentedUsers.others} color="gray" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function UserSegment({ title, users, color }: { title: string, users: any[], color: string }) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    gray: "bg-gray-50 text-gray-600 border-gray-100"
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <h4 className="font-black text-sm text-gray-500">{title}</h4>
        <Badge variant="outline" className="font-black border-gray-200">{users.length}명</Badge>
      </div>
      <div className="space-y-2">
        {users.length > 0 ? users.map((user) => (
          <Card key={user.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${colorClasses[color]}`}>
                  {user.displayName?.[0]}
                </div>
                <div>
                  <p className="font-black text-sm text-gray-800">{user.displayName}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {user.role === 'teacher' ? '교사' : user.role === 'pastor' ? '교역자' : `${user.role.replace('grade', '')}학년`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-800">{user.points?.toLocaleString()} D</p>
                <p className="text-[9px] font-bold text-gray-300">최근활동: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "-"}</p>
              </div>
            </CardContent>
          </Card>
        )) : (
          <p className="text-center py-4 text-xs font-bold text-gray-300">명단이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
