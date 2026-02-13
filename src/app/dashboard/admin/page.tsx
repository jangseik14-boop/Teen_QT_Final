
"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ArrowLeft, 
  TrendingUp, 
  GraduationCap,
  Settings2,
  UserX,
  Save,
  Plus,
  Minus,
  Phone,
  User
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [isManageOpen, setIsManageOpen] = useState(false);

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

  const handleManageUser = (user: any) => {
    setSelectedUser(user);
    setEditPoints(user.points || 0);
    setIsManageOpen(true);
  };

  const handleUpdatePoints = () => {
    if (!selectedUser) return;
    const userRef = doc(firestore, "users", selectedUser.id);
    updateDocumentNonBlocking(userRef, {
      points: editPoints,
      updatedAt: new Date().toISOString()
    });
    toast({ title: "수정 완료", description: `${selectedUser.displayName}님의 달란트가 수정되었습니다.` });
    setIsManageOpen(false);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    const userRef = doc(firestore, "users", selectedUser.id);
    deleteDocumentNonBlocking(userRef);
    toast({ title: "탈퇴 완료", description: "회원이 명단에서 삭제되었습니다.", variant: "destructive" });
    setIsManageOpen(false);
  };

  const roleLabels: Record<string, string> = {
    pastor: "교역자",
    teacher: "교사",
    grade7: "중1",
    grade8: "중2",
    grade9: "중3",
    grade10: "고1",
    grade11: "고2",
    grade12: "고3",
  };

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
              <UserSegment title="중남 (중등부 남자)" users={segmentedUsers.middleMale} color="blue" onManage={handleManageUser} />
              <UserSegment title="중여 (중등부 여자)" users={segmentedUsers.middleFemale} color="pink" onManage={handleManageUser} />
            </TabsContent>

            <TabsContent value="high" className="space-y-6 pt-4">
              <UserSegment title="고남 (고등부 남자)" users={segmentedUsers.highMale} color="indigo" onManage={handleManageUser} />
              <UserSegment title="고여 (고등부 여자)" users={segmentedUsers.highFemale} color="rose" onManage={handleManageUser} />
            </TabsContent>

            <TabsContent value="others" className="pt-4">
              <UserSegment title="기타 (교사/교역자)" users={segmentedUsers.others} color="gray" onManage={handleManageUser} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 회원 관리 다이얼로그 */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-[340px] p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Settings2 className="w-6 h-6 text-gray-600" />
            </div>
            <DialogTitle className="text-xl font-black text-center text-gray-800 tracking-tight italic">회원 관리</DialogTitle>
            <DialogDescription className="text-center text-gray-400 font-bold text-sm leading-relaxed">
              {selectedUser?.displayName}님 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-black text-gray-400 ml-1">기본 정보</Label>
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{roleLabels[selectedUser?.role || ""] || "일반"} / {selectedUser?.gender === 'male' ? '남성' : '여성'}</span>
                </div>
                {selectedUser?.phone && (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black text-gray-400 ml-1 italic">DALANT SETTING (D)</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl border-2 border-gray-100"
                  onClick={() => setEditPoints(Math.max(0, editPoints - 50))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input 
                  type="number"
                  value={editPoints}
                  onChange={(e) => setEditPoints(Number(e.target.value))}
                  className="h-12 bg-gray-50 border-none rounded-xl text-center font-black text-lg focus-visible:ring-purple-400"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl border-2 border-gray-100"
                  onClick={() => setEditPoints(editPoints + 50)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              onClick={handleUpdatePoints}
              className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 font-black shadow-lg shadow-purple-100"
            >
              <Save className="w-4 h-4 mr-2" /> 정보 저장하기
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-rose-500 font-black hover:text-rose-600 hover:bg-rose-50">
                  <UserX className="w-4 h-4 mr-2" /> 회원 강제 탈퇴
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2.5rem] max-w-[320px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black text-center">정말 탈퇴시킬까요?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center font-bold">
                    삭제된 정보는 복구할 수 없습니다.<br/>신중하게 결정해주세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2">
                  <AlertDialogCancel className="flex-1 rounded-xl font-bold">취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser} className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 font-bold">탈퇴시키기</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserSegment({ title, users, color, onManage }: { title: string, users: any[], color: string, onManage: (user: any) => void }) {
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
          <Card key={user.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white hover:ring-2 hover:ring-purple-100 transition-all cursor-pointer" onClick={() => onManage(user)}>
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
                <div className="flex items-center gap-1 justify-end text-[9px] font-bold text-gray-300">
                  <Settings2 className="w-2 h-2" /> 관리하기
                </div>
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
