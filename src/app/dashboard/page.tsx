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

const getTodayId = () => new Date().toISOString().split('T')[0];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  // 입력 상태
  const [reflection, setReflection] = useState("");
  const [resolution, setResolution] = useState("");
  const [prayer, setPrayer] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<GenerateMeditationOutput | null>(null);

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  const todayId = getTodayId();
  const meditationRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/meditations/${todayId}`) : null, [user, firestore, todayId]);
  const { data: todayMeditation } = useDoc(meditationRef);

  const userName = user?.displayName || "친구";
  const points = userProfile?.points || 0;

  const currentVerse = {
    ref: "애가 3:22-23",
    text: "여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다"
  };

  useEffect(() => {
    const fetchAI = async () => {
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
    fetchAI();
  }, []);

  const handleComplete = () => {
    if (!user || !userRef || !meditationRef) return;
    
    if (reflection.length < 10 || resolution.length < 10 || prayer.length < 10) {
      toast({ 
        title: "조금 더 정성을 들여볼까요?", 
        description: "각 항목을 최소 10자 이상 작성해주세요!", 
        variant: "destructive" 
      });
      return;
    }

    if (todayMeditation) {
      toast({ title: "이미 완료했어요!", description: "오늘 묵상은 이미 완료되었습니다. 내일 또 만나요!" });
      return;
    }

    setDocumentNonBlocking(meditationRef, {
      completedAt: new Date().toISOString(),
      reflection,
      resolution,
      prayer,
      verse: currentVerse.ref
    }, { merge: true });

    updateDocumentNonBlocking(userRef, {
      points: points + 50,
      updatedAt: new Date().toISOString()
    });

    toast({ 
      title: "묵상 완료! 🎉", 
      description: "50달란트(D)가 지급되었습니다. 참 잘했어요!",
    });
    
    setReflection("");
    setResolution("");
    setPrayer("");
  };

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
  }).format(new Date());

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24 shadow-xl rounded-[3rem] overflow-hidden relative border border-gray-100">
      <header className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#C026D3] tracking-tight">예본TeenQT</h1>
          <p className="text-gray-500 text-sm font-medium">환영합니다, {userName}님!</p>
        </div>
        <div className="bg-[#FEF9C3] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-yellow-200">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-black text-yellow-700 tracking-tight">{points.toLocaleString()} D</span>
        </div>
      </header>

      <div className="px-5 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pb-10">
        <Card className="border-none bg-[#EEF2FF] rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 space-y-3">
            <p className="text-[#6366F1] font-bold text-sm">{todayStr}</p>
            <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight">아침마다 새로운 긍휼</h2>
            <div className="flex items-center gap-2 text-[#6366F1]">
              <BookMarked className="w-4 h-4" />
              <span className="font-bold text-sm">{currentVerse.ref}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-[#F0F9FF] rounded-[2rem]">
          <CardContent className="p-8 text-center italic text-[#0369A1] font-bold text-lg leading-relaxed">
            "{currentVerse.text}"
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-6 bg-[#EC4899] rounded-full" />
            <h3 className="font-black text-lg text-gray-800 italic flex items-center gap-2">
              말씀 해설 <Sparkles className="w-4 h-4 text-accent" />
            </h3>
          </div>
          <Card className="border-none bg-[#FDF2F8] rounded-[2rem]">
            <CardContent className="p-7 text-gray-600 font-medium leading-relaxed text-[15px]">
              {isGenerating ? (
                <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> AI가 말씀을 해석하고 있어요...
                </div>
              ) : (
                aiContent?.commentary || "하나님의 사랑과 용서는 매일 아침 뜨는 해처럼 항상 새롭고 끝이 없답니다."
              )}
            </CardContent>
          </Card>
        </div>

        {todayMeditation ? (
          <div className="bg-green-50 border border-green-200 rounded-[2rem] p-10 text-center space-y-4">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-green-700">오늘의 묵상 완료!</p>
              <p className="text-sm font-medium text-green-600">내일 또 새로운 말씀으로 만나요.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-none bg-[#FFFBEB] rounded-[2.5rem] p-7 space-y-8">
              {/* 묵상하기 (Q1) */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-black text-lg text-[#92400E]">묵상하기</h3>
                  <p className="text-[#B45309] text-sm font-bold leading-relaxed">
                    {isGenerating ? "질문을 생각 중..." : `Q1. ${aiContent?.q1 || "하나님의 성실하심을 경험했던 순간이 있나요?"}`}
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

              {/* 결단 및 다짐 (Q2) */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-black text-lg text-[#92400E]">결단 및 다짐</h3>
                  <p className="text-[#B45309] text-sm font-bold leading-relaxed">
                    {isGenerating ? "다짐을 생각 중..." : `Q2. ${aiContent?.q2 || "내 실수보다 훨씬 더 크고 무한한 하나님의 용서를 의지하며, 매일 새롭게 다시 시작해 보세요."}`}
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

            {/* 기도하기 */}
            <Card className="border-none bg-[#F5F3FF] rounded-[2.5rem] p-7 space-y-4">
              <h3 className="font-black text-lg text-[#5B21B6]">기도하기</h3>
              <Textarea 
                placeholder="10자 이상 작성해주세요..."
                value={prayer}
                onChange={(e) => setPrayer(e.target.value)}
                className="bg-white border-violet-100 rounded-2xl min-h-[120px] p-4 text-sm focus-visible:ring-violet-400 focus-visible:border-violet-400 placeholder:text-gray-300 resize-none shadow-sm"
              />
            </Card>

            <Button 
              onClick={handleComplete}
              disabled={isGenerating}
              className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#A855F7] to-[#EC4899] font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              완료하고 50달란트 받기
            </Button>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
          <BookOpen className="w-6 h-6 text-[#C026D3]" />
          <span className="text-[11px] font-black text-[#C026D3]">QT</span>
        </Link>
        <Link href="/dashboard/quiz" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[11px] font-bold">상점</span>
        </Link>
        <Link href="/dashboard/ranking" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <Trophy className="w-6 h-6" />
          <span className="text-[11px] font-bold">랭킹</span>
        </Link>
        <Link href="/dashboard/my" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-gray-600 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[11px] font-bold">MY</span>
        </Link>
      </nav>
    </div>
  );
}
