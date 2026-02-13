"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Star, 
  PartyPopper, 
  Trophy, 
  ShoppingBag, 
  User, 
  ChevronRight,
  BookMarked,
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { generateMeditation, type GenerateMeditationOutput } from "@/ai/flows/generate-meditation";
import { toast } from "@/hooks/use-toast";

// 오늘 날짜 ID 생성 (YYYY-MM-DD)
const getTodayId = () => new Date().toISOString().split('T')[0];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [reflection, setReflection] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<GenerateMeditationOutput | null>(null);

  // 현재 유저 정보 및 포인트 가져오기
  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserLoading } = useDoc(userRef);

  // 오늘 묵상 완료 여부 확인
  const todayId = getTodayId();
  const meditationRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/meditations/${todayId}`) : null, [user, firestore, todayId]);
  const { data: todayMeditation, isLoading: isMeditationLoading } = useDoc(meditationRef);

  const userName = user?.displayName || "친구";
  const points = userProfile?.points || 0;

  // 기본 말씀 데이터 (해설은 AI가 생성)
  const currentVerse = {
    ref: "애가 3:22-23",
    text: "여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다"
  };

  useEffect(() => {
    const fetchAICommentary = async () => {
      if (aiContent) return;
      setIsGenerating(true);
      try {
        const result = await generateMeditation({
          verse: currentVerse.ref,
          verseText: currentVerse.text
        });
        setAiContent(result);
      } catch (error) {
        console.error("AI 생성 실패:", error);
      } finally {
        setIsGenerating(false);
      }
    };
    fetchAICommentary();
  }, []);

  const handleComplete = () => {
    if (!user || !userRef || !meditationRef) return;
    if (reflection.length < 10) {
      toast({ title: "조금 더 써볼까요?", description: "최소 10자 이상 작성해주세요!", variant: "destructive" });
      return;
    }

    if (todayMeditation) {
      toast({ title: "이미 완료했어요!", description: "오늘 묵상은 이미 완료되었습니다. 내일 또 만나요!" });
      return;
    }

    // 1. 오늘 묵상 완료 기록
    setDocumentNonBlocking(meditationRef, {
      completedAt: new Date().toISOString(),
      reflection: reflection,
      verse: currentVerse.ref
    }, { merge: true });

    // 2. 포인트 지급 (+50D)
    updateDocumentNonBlocking(userRef, {
      points: points + 50,
      updatedAt: new Date().toISOString()
    });

    toast({ 
      title: "묵상 완료! 🎉", 
      description: "50D가 지급되었습니다. 참 잘했어요!",
    });
    setReflection("");
  };

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
  }).format(new Date());

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-xl rounded-[3rem] overflow-hidden relative border border-gray-100">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight">
            예본TeenQT
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            환영합니다, {userName}님!
          </p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">
            {points.toLocaleString()} D
          </span>
        </div>
      </header>

      <div className="px-5 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pb-10">
        {/* Date & Title Card */}
        <Card className="border-none bg-[#EEF2FF] rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 space-y-3">
            <p className="text-[#6366F1] font-bold text-sm">
              {todayStr}
            </p>
            <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight">
              아침마다 새로운 긍휼
            </h2>
            <div className="flex items-center gap-2 text-[#6366F1]">
              <BookMarked className="w-4 h-4" />
              <span className="font-bold text-sm">{currentVerse.ref}</span>
            </div>
          </CardContent>
        </Card>

        {/* Verse Quote Card */}
        <Card className="border-none bg-[#F0F9FF] rounded-[2rem]">
          <CardContent className="p-8 text-center italic text-[#0369A1] font-bold text-lg leading-relaxed">
            "{currentVerse.text}"
          </CardContent>
        </Card>

        {/* Meditation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-6 bg-[#EC4899] rounded-full" />
            <h3 className="font-black text-lg text-gray-800 italic flex items-center gap-2">
              말씀 묵상 <Sparkles className="w-4 h-4 text-accent" />
            </h3>
          </div>
          <Card className="border-none bg-[#FDF2F8] rounded-[2rem]">
            <CardContent className="p-7 text-gray-600 font-medium leading-relaxed text-[15px]">
              {isGenerating ? (
                <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI가 말씀을 해석하고 있어요...
                </div>
              ) : (
                aiContent?.commentary || "하나님의 사랑과 용서는 매일 아침 뜨는 해처럼 항상 새롭고 끝이 없답니다."
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reflection Input Section */}
        <div className="space-y-4">
          <Card className="border-none bg-[#FFFBEB] rounded-[2rem] p-7 space-y-5">
            <div className="space-y-2">
              <h3 className="font-black text-lg text-[#92400E]">묵상하기</h3>
              <p className="text-[#B45309] text-sm font-bold leading-relaxed">
                {aiContent?.question || "Q1. 하나님의 성실하심을 경험했던 순간이 있나요?"}
              </p>
            </div>
            {todayMeditation ? (
              <div className="bg-white/50 border border-yellow-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-bold text-gray-600">오늘의 묵상을 완료했습니다!</p>
                <p className="text-xs text-gray-400">내일 또 만나요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  placeholder="10자 이상 작성해주세요..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="bg-white border-yellow-100 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none"
                />
                <Button 
                  onClick={handleComplete}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] font-bold text-lg shadow-lg"
                >
                  묵상 완료하고 50D 받기
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Resolution Section placeholder */}
        <div className="space-y-4 pb-10">
           <div className="flex justify-between items-center px-1">
             <h3 className="font-black text-lg text-gray-800">결단 및 다짐</h3>
             <ChevronRight className="w-5 h-5 text-gray-400" />
           </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
          <BookOpen className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">QT</span>
        </Link>
        <Link href="/dashboard/events" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <PartyPopper className="w-6 h-6" />
          <span className="text-[11px] font-bold">이벤트</span>
        </Link>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <Trophy className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}
