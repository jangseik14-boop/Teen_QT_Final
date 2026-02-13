
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
  User,
  BookOpen,
  Trash2,
  Calendar,
  AlertCircle,
  Trophy,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc, where } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // 모든 사용자 가져오기
  const usersQuery = useMemoFirebase(() => query(
    collection(firestore, "users")
  ), [firestore]);

  const { data: rawUsers, isLoading } = useCollection(usersQuery);

  // 상품 신청 내역 가져오기
  const requestsQuery = useMemoFirebase(() => query(
    collection(firestore, "productRequests"),
    orderBy("createdAt", "desc")
  ), [firestore]);

  const { data: productRequests, isLoading: isReqLoading } = useCollection(requestsQuery);

  // 메모리에서 누적 포인트 순으로 정렬
  const allUsers = useMemo(() => {
    if (!rawUsers) return null;
    return [...rawUsers].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  }, [rawUsers]);

  // 선택된 사용자의 묵상 기록 가져오기
  const meditationQuery = useMemoFirebase(() => selectedUser ? query(
    collection(firestore, `users/${selectedUser.id}/meditations`),
    orderBy("completedAt", "desc")
  ) : null, [firestore, selectedUser]);

  const { data: userMeditations, isLoading: isMedLoading } = useCollection(meditationQuery);

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
    
    const oldPoints = selectedUser.points || 0;
    const newPoints = editPoints;
    const diff = newPoints - oldPoints;
    
    let updatedTotalPoints = selectedUser.totalPoints || 0;
    if (diff > 0) {
      updatedTotalPoints += diff;
    }

    const userRef = doc(firestore, "users", selectedUser.id);
    updateDocumentNonBlocking(userRef, {
      points: newPoints,
      totalPoints: updatedTotalPoints,
      updatedAt: new Date().toISOString()
    });
    
    toast({ title: "수정 완료", description: `${selectedUser.displayName}님의 정보가 수정되었습니다.` });
    setIsManageOpen(false);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    const userRef = doc(firestore, "users", selectedUser.id);
    deleteDocumentNonBlocking(userRef);
    toast({ title: "탈퇴 완료", description: "회원이 명단에서 삭제되었습니다.", variant: "destructive" });
    setIsManageOpen(false);
  };

  const handleInvalidateMeditation = (meditationId: string) => {
    if (!selectedUser) return;
    
    const userRef = doc(firestore, "users", selectedUser.id);
    const newPoints = Math.max(0, (selectedUser.points || 0) - 50);
    const newTotalPoints = Math.max(0, (selectedUser.totalPoints || 0) - 50);
    
    updateDocumentNonBlocking(userRef, {
      points: newPoints,
      totalPoints: newTotalPoints,
      updatedAt: new Date().toISOString()
    });

    const medRef = doc(firestore, `users/${selectedUser.id}/meditations`, meditationId);
    deleteDocumentNonBlocking(medRef);

    toast({ 
      title: "묵상 취소 완료", 
      description: "묵상 내용이 삭제되고 50달란트가 회수되었습니다.",
      variant: "destructive"
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    const reqRef = doc(firestore, "productRequests", requestId);
    deleteDocumentNonBlocking(reqRef);
    toast({ title: "삭제 완료", description: "신청 내역이 삭제되었습니다." });
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
              <MessageSquare className="w-5 h-5 text-purple-500 mb-1" />
              <p className="text-xs font-bold text-purple-600 uppercase tracking-tighter">상품 신청</p>
              <p className="text-2xl font-black text-purple-900">{productRequests?.length || 0}건</p>
            </CardContent>
          </Card>
        </div>

        {/* 명단 및 신청 관리 섹션 */}
        <div className="space-y-4">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="w-full bg-white border-2 border-gray-100 p-1 rounded-2xl h-12 mb-6">
              <TabsTrigger value="list" className="flex-1 rounded-xl font-bold data-[state=active]:bg-gray-100">회원 명단</TabsTrigger>
              <TabsTrigger value="requests" className="flex-1 rounded-xl font-bold data-[state=active]:bg-gray-100">상품 신청</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <Tabs defaultValue="middle" className="w-full">
                <TabsList className="w-full bg-white/50 border border-gray-100 p-1 rounded-xl h-10 mb-4">
                  <TabsTrigger value="middle" className="flex-1 rounded-lg text-xs font-bold">중등부</TabsTrigger>
                  <TabsTrigger value="high" className="flex-1 rounded-lg text-xs font-bold">고등부</TabsTrigger>
                  <TabsTrigger value="others" className="flex-1 rounded-lg text-xs font-bold">기타</TabsTrigger>
                </TabsList>

                <TabsContent value="middle" className="space-y-6">
                  <UserSegment title="중남 (중등부 남자)" users={segmentedUsers.middleMale} color="blue" onManage={handleManageUser} />
                  <UserSegment title="중여 (중등부 여자)" users={segmentedUsers.middleFemale} color="pink" onManage={handleManageUser} />
                </TabsContent>

                <TabsContent value="high" className="space-y-6">
                  <UserSegment title="고남 (고등부 남자)" users={segmentedUsers.highMale} color="indigo" onManage={handleManageUser} />
                  <UserSegment title="고여 (고등부 여자)" users={segmentedUsers.highFemale} color="rose" onManage={handleManageUser} />
                </TabsContent>

                <TabsContent value="others">
                  <UserSegment title="기타 (교사/교역자)" users={segmentedUsers.others} color="gray" onManage={handleManageUser} />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-sm text-gray-500 italic">신규 상품 신청 내역</h3>
                <Badge variant="outline" className="font-black border-gray-200">{productRequests?.length || 0}건</Badge>
              </div>
              
              <div className="space-y-3">
                {isReqLoading ? (
                  <p className="text-center py-10 text-xs font-bold text-gray-300 animate-pulse">불러오는 중...</p>
                ) : productRequests && productRequests.length > 0 ? (
                  productRequests.map((req) => (
                    <Card key={req.id} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider mb-0.5">Requester</p>
                            <p className="font-black text-sm text-gray-800">{req.userName} 학생</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteRequest(req.id)}
                            className="h-8 w-8 text-gray-300 hover:text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 mb-1">Requested Product</p>
                          <p className="text-sm font-bold text-gray-700">{req.requestedProduct}</p>
                        </div>
                        <div className="flex justify-end">
                          <p className="text-[10px] font-bold text-gray-300">{new Date(req.createdAt).toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-300">신청된 상품이 없습니다.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 회원 관리 다이얼로그 (생략 없이 유지) */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-[400px] p-6 border-none shadow-2xl h-[90vh] flex flex-col">
          <DialogHeader className="space-y-2 shrink-0">
            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-1">
              <Settings2 className="w-5 h-5 text-gray-600" />
            </div>
            <DialogTitle className="text-xl font-black text-center text-gray-800 tracking-tight italic">회원 관리</DialogTitle>
            <DialogDescription className="text-center text-gray-400 font-bold text-sm">
              {selectedUser?.displayName}님 상세 정보 및 활동
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-4 px-1">
            <div className="space-y-6 pb-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider">Basic Info</Label>
                <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-100">
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider italic">Current (D)</Label>
                  <Input 
                    type="number"
                    value={editPoints}
                    onChange={(e) => setEditPoints(Number(e.target.value))}
                    className="h-12 bg-gray-50 border-none rounded-xl text-center font-black text-lg focus-visible:ring-purple-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-purple-400 ml-1 uppercase tracking-wider italic">Total (D) - Auto</Label>
                  <Input 
                    type="number"
                    value={selectedUser?.totalPoints || 0}
                    readOnly
                    disabled
                    className="h-12 bg-purple-50/50 border-none rounded-xl text-center font-black text-lg text-purple-700 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <Separator className="bg-gray-100" />

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Meditation History
                </Label>
                
                <div className="space-y-3">
                  {isMedLoading ? (
                    <p className="text-center py-4 text-xs font-bold text-gray-300 animate-pulse">불러오는 중...</p>
                  ) : userMeditations && userMeditations.length > 0 ? (
                    userMeditations.map((med) => (
                      <Card key={med.id} className="border-2 border-gray-50 rounded-2xl shadow-none bg-white overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-xs font-black text-purple-600">
                              <Calendar className="w-3 h-3" />
                              {med.id}
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-[2.5rem] max-w-[320px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-black text-center text-rose-600">묵상을 취소할까요?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-center font-bold text-gray-500">
                                    기록이 삭제되고 50달란트가 회수됩니다.<br/>학생은 이 날짜의 묵상을 다시 작성할 수 있게 됩니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-row gap-2">
                                  <AlertDialogCancel className="flex-1 rounded-xl font-bold">아니오</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleInvalidateMeditation(med.id)} className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 font-bold">네, 취소합니다</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                              <p className="text-[10px] font-black text-amber-600 mb-0.5">Q1. 묵상</p>
                              <p className="text-[11px] font-bold text-gray-700 leading-relaxed">{med.reflection}</p>
                            </div>
                            <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                              <p className="text-[10px] font-black text-blue-600 mb-0.5">Q2. 다짐</p>
                              <p className="text-[11px] font-bold text-gray-700 leading-relaxed">{med.resolution}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                      <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-300">작성된 묵상이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex-col gap-2 sm:flex-col pt-4 shrink-0 bg-white">
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
        <Badge variant="outline" className="font-black border-gray-200 text-[10px]">{users.length}명</Badge>
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
                  <Trophy className="w-2 h-2 text-purple-400" /> {(user.totalPoints || 0).toLocaleString()}
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
