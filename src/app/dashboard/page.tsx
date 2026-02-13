
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
  Calendar,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { generateMeditation } from "@/ai/flows/generate-meditation";
import { toast } from "@/hooks/use-toast";
import { getVerseForToday } from "@/lib/bible-verses";

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
  const currentVerse = getVerseForToday();

  // 1. 사용자 정보 및 포인트 가져오기
  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  // 2. 사용자의 오늘 묵상 완료 여부 확인
  const userMeditationRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/meditations/${todayId}`) : null, [user, firestore, todayId]);
  const { data: todayUserMeditation } = useDoc(userMeditationRef);

  // 3. 전역 공유 묵상 데이터 가져오기 (dailyMeditations 컬렉션)
  const globalMeditationRef = useMemoFirebase(() => doc(firestore, "dailyMeditations", todayId), [firestore, todayId]);
  const { data: globalMeditation, isLoading: isGlobalLoading } = useDoc(globalMeditationRef);

  // 4. AI 해설 자동 생성 및 저장 로직
  useEffect(() => {
    const fetchOrGenerateAI = async () => {
      // 이미 데이터가 있거나 로딩 중이면 건너뜀
      if (isGlobalLoading || globalMeditation?.commentary || isGenerating) return;

      setIsGenerating(true);
      try {
        // 1순위: 미리 정의된 데이터가 있는지 확인 (시편 23:1 등 수동 입력값)
        if (currentVerse.preDefined) {
          setDocumentNonBlocking(globalMeditationRef, {
            ...currentVerse.preDefined,
            verse: currentVerse.ref,
            verseText: currentVerse.text,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } else {
          // 2순위: 없다면 AI 실시간 생성
          const result = await generateMeditation({
            verse: currentVerse.ref,
            verseText: currentVerse.text
          });

          if (result && result.commentary) {
            setDocumentNonBlocking(globalMeditationRef, {
              ...result,
              verse: currentVerse.ref,
              verseText: currentVerse.text,
              createdAt: new Date().toISOString()
            }, { merge: true });
          }
        }
      } catch (error) {
        console.error("AI 생성 실패:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    if (user && !isGlobalLoading) {
      fetchOrGenerateAI();
    }
  }, [globalMeditation, isGlobalLoading, user, todayId, currentVerse, globalMeditationRef, isGenerating]);

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
    <div className="max-w-md mx-auto bg-[#F0F7FF] min-h-screen pb-24 shadow-2xl overflow-hidden relative border-x border-blue-200 font-body">
      {/* 상단 헤더 */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-2 border-blue-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight italic">예본TeenQT</h1>
          <p className="text-gray-500 text-xs font-bold flex items-center gap-1">
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> 반가워요, {user?.displayName || "친구"}님!
          </p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border-2 border-yellow-300">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">{(userProfile?.points || 0).toLocaleString()} D</span>
        </div>
      </header>

      <div className="px-5 space-y-6 pt-6 pb-10">
        {/* 오늘의 주제 카드 */}
        <Card className="border-2 border-blue-300 bg-white rounded-[2.5rem] overflow-hidden shadow-md">
          <CardContent className="p-8 space-y-3">
            <div className="flex items-center gap-2 text-[#6366F1] mb-1">
              <Calendar className="w-4 h-4" />
              <p className="font-bold text-xs uppercase tracking-wider">{todayStr}</p>
            </div>
            <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight leading-tight">아침마다 새로운 은혜</h2>
            <div className="flex items-center gap-2 text-[#6366F1]">
              <BookMarked className="w-4 h-4" />
              <span className="font-black text-sm">{currentVerse.ref}</span>
            </div>
          </CardContent>
        </Card>

        {/* 말씀 구절 카드 */}
        <Card className="border-2 border-sky-300 bg-[#F0F9FF] rounded-[2.5rem] shadow-md">
          <CardContent className="p-8 text-center italic text-[#0369A1] font-bold text-lg leading-relaxed">
            "{currentVerse.text}"
          </CardContent>
        </Card>

        {/* 말씀해설 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-6 bg-[#EC4899] rounded-full" />
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 italic">
              말씀해설 <Sparkles className="w-4 h-4 text-[#22C3C3] animate-pulse" />
            </h3>
          </div>
          <Card className="border-2 border-pink-200 bg-white rounded-[2.5rem] shadow-md overflow-hidden">
            <div className="h-2 bg-[#FDF2F8]" />
            <CardContent className="p-7 text-gray-700 font-medium leading-relaxed text-[15px]">
              {isGenerating || isGlobalLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3 text-muted-foreground animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-400" /> 
                  <span className="font-bold text-sm text-pink-400">말씀을 힙하게 해석하는 중...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-[1.6]">
                  {globalMeditation?.commentary || "오늘의 말씀을 통해 하나님의 사랑을 듬뿍 느껴보세요! 잠시 후 해설이 나타납니다."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 묵상 입력 폼 또는 완료 메시지 */}
        {todayUserMeditation ? (
          <div className="bg-green-50 border-2 border-green-300 rounded-[2.5rem] p-10 text-center space-y-4 animate-in fade-in zoom-in duration-500 shadow-lg">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md border-4 border-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-black text-green-700">오늘의 묵상 완료! 🎉</p>
              <p className="text-sm font-medium text-green-600 leading-relaxed">
                참 잘했어요! 50달란트가 적립되었습니다.<br/>내일 아침 새로운 말씀으로 또 만나요.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-amber-300 bg-[#FFFBEB] rounded-[2.5rem] p-7 space-y-8 shadow-md">
              {/* Q1 섹션 */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Q1. 묵상하기</span>
                  </div>
                  <h3 className="font-black text-lg text-[#92400E] leading-snug">
                    {isGenerating || isGlobalLoading ? "질문을 생각 중..." : globalMeditation?.q1 || "말씀을 통해 느낀 점을 적어보세요."}
                  </h3>
                </div>
                <Textarea 
                  placeholder="여기에 솔직한 마음을 적어주세요... (10자 이상)"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="bg-white border-2 border-amber-200 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none shadow-inner"
                />
              </div>

              <div className="h-px bg-amber-200/50" />

              {/* Q2 섹션 */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Q2. 결단 및 다짐</span>
                  </div>
                  <h3 className="font-black text-lg text-[#92400E] leading-snug">
                    {isGenerating || isGlobalLoading ? "다짐을 생각 중..." : globalMeditation?.q2 || "오늘 하루 무엇을 실천하고 싶나요?"}
                  </h3>
                </div>
                <Textarea 
                  placeholder="오늘 하루 꼭 지킬 한 가지를 적어봐요! (10자 이상)"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="bg-white border-2 border-amber-200 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none shadow-inner"
                />
              </div>
            </Card>

            {/* 기도 섹션 */}
            <Card className="border-2 border-violet-300 bg-[#F5F3FF] rounded-[2.5rem] p-7 space-y-4 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#8B5CF6] rounded-full" />
                <h3 className="font-black text-lg text-[#5B21B6]">🙏 오늘의 기도</h3>
              </div>
              <Textarea 
                placeholder="하나님께 드리는 짧은 기도문을 적어보세요. (10자 이상)"
                value={prayer}
                onChange={(e) => setPrayer(e.target.value)}
                className="bg-white border-2 border-violet-200 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-violet-400 focus-visible:border-violet-400 placeholder:text-gray-300 resize-none shadow-inner"
              />
            </Card>

            {/* 완료 버튼 */}
            <Button 
              onClick={handleComplete}
              disabled={isGenerating || isGlobalLoading}
              className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#A855F7] to-[#EC4899] font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all mb-4"
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
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t-2 border-blue-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
          <BookOpen className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">QT</span>
        </Link>
        <div className="flex flex-col items-center gap-1 group text-gray-400">
          <Calendar className="w-6 h-6" />
          <span className="text-[11px] font-bold">이벤트</span>
        </div>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-[#C026D3] transition-colors">
          <Trophy className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-[#C026D3] transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-[#C026D3] transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}
