"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Star, 
  Trophy, 
  ShoppingBag, 
  User, 
  BookMarked,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { generateMeditation } from "@/ai/flows/generate-meditation";
import { toast } from "@/hooks/use-toast";

// 오늘 날짜 ID 생성 (YYYY-MM-DD)
const getTodayId = () => new Date().toISOString().split('T')[0];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [reflection, setReflection] = useState("");
  const [resolution, setResolution] = useState("");
  const [prayer, setPrayer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const todayId = getTodayId();

  // 1. 사용자 정보 및 포인트 가져오기
  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  // 2. 사용자의 오늘 묵상 완료 여부 확인
  const userMeditationRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/meditations/${todayId}`) : null, [user, firestore, todayId]);
  const { data: todayUserMeditation } = useDoc(userMeditationRef);

  // 3. 전역 공유 묵상 데이터 (AI 해설 및 질문) 가져오기
  const globalMeditationRef = useMemoFirebase(() => doc(firestore, "dailyMeditations", todayId), [firestore, todayId]);
  const { data: globalMeditation, isLoading: isGlobalLoading } = useDoc(globalMeditationRef);

  // 오늘의 고정 구절 (관리자가 나중에 바꿀 수 있음)
  const currentVerse = {
    ref: "애가 3:22-23",
    text: "여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다"
  };

  // 4. AI 데이터가 없으면 최초 접속자가 생성하여 저장
  useEffect(() => {
    const fetchOrGenerateAI = async () => {
      // 이미 데이터가 있거나 로딩 중이면 건너뜀
      if (isGlobalLoading || globalMeditation?.commentary) return;

      setIsGenerating(true);
      try {
        const result = await generateMeditation({
          verse: currentVerse.ref,
          verseText: currentVerse.text
        });

        // 생성된 내용을 Firestore 전역 컬렉션에 저장 (이후 접속자는 이 데이터를 사용함)
        setDocumentNonBlocking(globalMeditationRef, {
          ...result,
          verse: currentVerse.ref,
          verseText: currentVerse.text,
          createdAt: new Date().toISOString()
        }, { merge: true });

      } catch (error) {
        console.error("AI 생성 실패:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    if (user) {
      fetchOrGenerateAI();
    }
  }, [globalMeditation, isGlobalLoading, user, todayId, currentVerse, globalMeditationRef]);

  const handleComplete = () => {
    if (!user || !userRef || !userMeditationRef) return;
    
    // 유효성 검사: 각 항목 10자 이상
    if (reflection.trim().length < 10 || resolution.trim().length < 10 || prayer.trim().length < 10) {
      toast({ 
        title: "조금 더 정성을 들여볼까요?", 
        description: "각 항목을 최소 10자 이상 채워주세요!", 
        variant: "destructive" 
      });
      return;
    }

    if (todayUserMeditation) {
      toast({ title: "이미 완료했어요!", description: "오늘 묵상은 이미 완료되었습니다. 내일 또 만나요!" });
      return;
    }

    // 1. 개인 묵상 기록 저장
    setDocumentNonBlocking(userMeditationRef, {
      completedAt: new Date().toISOString(),
      reflection,
      resolution,
      prayer,
      verse: currentVerse.ref
    }, { merge: true });

    // 2. 달란트 지급 (50D)
    const currentPoints = userProfile?.points || 0;
    updateDocumentNonBlocking(userRef, {
      points: currentPoints + 50,
      updatedAt: new Date().toISOString()
    });

    toast({ 
      title: "묵상 완료! 🎉", 
      description: "50달란트(D)가 적립되었습니다. 참 잘했어요!",
    });
  };

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
  }).format(new Date());

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-xl rounded-[3rem] overflow-hidden relative border border-gray-100 font-body">
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight italic">예본TeenQT</h1>
          <p className="text-gray-500 text-sm font-medium">반가워요, {user?.displayName || "친구"}님!</p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">{(userProfile?.points || 0).toLocaleString()} D</span>
        </div>
      </header>

      <div className="px-5 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] pb-10 scrollbar-hide">
        {/* 오늘의 주제 카드 */}
        <Card className="border-none bg-[#EEF2FF] rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 space-y-3">
            <div className="flex items-center gap-2 text-[#6366F1] mb-1">
              <Calendar className="w-4 h-4" />
              <p className="font-bold text-xs uppercase tracking-wider">{todayStr}</p>
            </div>
            <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight">아침마다 새로운 긍휼</h2>
            <div className="flex items-center gap-2 text-[#6366F1]">
              <BookMarked className="w-4 h-4" />
              <span className="font-bold text-sm">{currentVerse.ref}</span>
            </div>
          </CardContent>
        </Card>

        {/* 말씀 구절 카드 */}
        <Card className="border-none bg-[#F0F9FF] rounded-[2rem]">
          <CardContent className="p-8 text-center italic text-[#0369A1] font-bold text-lg leading-relaxed">
            "{currentVerse.text}"
          </CardContent>
        </Card>

        {/* AI 말씀 해설 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-6 bg-[#EC4899] rounded-full" />
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 italic">
              말씀 해설 <Sparkles className="w-4 h-4 text-[#22C3C3]" />
            </h3>
          </div>
          <Card className="border-none bg-[#FDF2F8] rounded-[2rem]">
            <CardContent className="p-7 text-gray-600 font-medium leading-relaxed text-[15px]">
              {isGenerating || isGlobalLoading ? (
                <div className="flex items-center justify-center py-4 gap-3 text-muted-foreground animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" /> 
                  <span className="font-bold">오늘의 해설을 불러오는 중...</span>
                </div>
              ) : (
                globalMeditation?.commentary || "하나님의 사랑과 용서는 매일 아침 뜨는 해처럼 항상 새롭고 끝이 없답니다."
              )}
            </CardContent>
          </Card>
        </div>

        {/* 묵상 입력 폼 또는 완료 메시지 */}
        {todayUserMeditation ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-[2.5rem] p-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md border-4 border-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-green-700">오늘의 묵상 완료! 🎉</p>
              <p className="text-sm font-medium text-green-600 leading-relaxed">
                훌륭해요! 50달란트가 적립되었습니다.<br/>내일 아침 새로운 말씀으로 또 만나요.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-none bg-[#FFFBEB] rounded-[2.5rem] p-7 space-y-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Q1</span>
                    <h3 className="font-black text-lg text-[#92400E]">묵상하기</h3>
                  </div>
                  <p className="text-[#B45309] text-[15px] font-bold leading-relaxed pl-1">
                    {isGenerating || isGlobalLoading ? "질문을 생각 중..." : globalMeditation?.q1 || "하나님의 성실하심을 경험했던 순간이 있나요?"}
                  </p>
                </div>
                <Textarea 
                  placeholder="10자 이상 작성해주세요..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="bg-white border-yellow-100 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none shadow-sm"
                />
              </div>

              <div className="h-px bg-yellow-200/50" />

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Q2</span>
                    <h3 className="font-black text-lg text-[#92400E]">결단 및 다짐</h3>
                  </div>
                  <p className="text-[#B45309] text-[15px] font-bold leading-relaxed pl-1">
                    {isGenerating || isGlobalLoading ? "다짐을 생각 중..." : globalMeditation?.q2 || "오늘 하루 무엇을 실천해보고 싶나요?"}
                  </p>
                </div>
                <Textarea 
                  placeholder="10자 이상 작성해주세요..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="bg-white border-yellow-100 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none shadow-sm"
                />
              </div>
            </Card>

            <Card className="border-none bg-[#F5F3FF] rounded-[2.5rem] p-7 space-y-4">
              <h3 className="font-black text-lg text-[#5B21B6]">🙏 기도하기</h3>
              <Textarea 
                placeholder="10자 이상 작성해주세요..."
                value={prayer}
                onChange={(e) => setPrayer(e.target.value)}
                className="bg-white border-violet-100 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-violet-400 focus-visible:border-violet-400 placeholder:text-gray-300 resize-none shadow-sm"
              />
            </Card>

            <Button 
              onClick={handleComplete}
              disabled={isGenerating || isGlobalLoading}
              className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#A855F7] to-[#EC4899] font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isGenerating || isGlobalLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-5 h-5 mr-2" />
              )}
              완료하고 50달란트 받기
            </Button>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
          <BookOpen className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">QT</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-[#C026D3] transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-[#C026D3] transition-colors">
          <Trophy className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-[#C026D3] transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}
