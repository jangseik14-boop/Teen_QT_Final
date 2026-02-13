
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
  Heart,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { generateMeditation } from "@/ai/flows/generate-meditation";
import { toast } from "@/hooks/use-toast";
import { getVerseForToday } from "@/lib/bible-verses";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

  const userRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userRef);

  const userMeditationRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/meditations/${todayId}`) : null, [user, firestore, todayId]);
  const { data: todayUserMeditation } = useDoc(userMeditationRef);

  const globalMeditationRef = useMemoFirebase(() => doc(firestore, "dailyMeditations", todayId), [firestore, todayId]);
  const { data: globalMeditation, isLoading: isGlobalLoading } = useDoc(globalMeditationRef);

  // 로컬 프리셋이 있으면 즉시 표시하고, 없으면 AI 생성을 기다림
  const displayCommentary = globalMeditation?.commentary || currentVerse.preDefined?.commentary;
  const displayQ1 = globalMeditation?.q1 || currentVerse.preDefined?.q1;
  const displayQ2 = globalMeditation?.q2 || currentVerse.preDefined?.q2;

  useEffect(() => {
    const fetchOrGenerateAI = async () => {
      // 이미 글로벌 데이터가 있으면 중단 (고정값 유지)
      if (isGlobalLoading || globalMeditation?.commentary || isGenerating) return;

      setIsGenerating(true);
      try {
        if (currentVerse.preDefined) {
          // 프리셋 데이터가 있다면 공통 DB에 바로 저장하여 모든 학생이 공유하게 함
          setDocumentNonBlocking(globalMeditationRef, {
            ...currentVerse.preDefined,
            verse: currentVerse.ref,
            verseText: currentVerse.text,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } else {
          // 프리셋이 없으면 AI가 생성하여 저장 (첫 방문자 1회만 수행)
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
        console.error("콘텐츠 생성 실패:", error);
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
    
    if (reflection.trim().length < 20 || resolution.trim().length < 20 || prayer.trim().length < 10) {
      toast({ 
        title: "조금 더 정성을 들여볼까요?", 
        description: "묵상(Q1)과 다짐(Q2)은 20자 이상, 기도는 10자 이상 채워주세요!", 
        variant: "destructive" 
      });
      return;
    }

    if (todayUserMeditation) {
      toast({ title: "이미 완료했어요!", description: "오늘 묵상은 이미 완료되었습니다. 내일 또 만나요!" });
      return;
    }

    setDocumentNonBlocking(userMeditationRef, {
      completedAt: new Date().toISOString(),
      reflection,
      resolution,
      prayer,
      verse: currentVerse.ref
    }, { merge: true });

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

  const CharCount = ({ count, target = 10 }: { count: number; target?: number }) => (
    <div className={cn(
      "text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm transition-colors",
      count >= target 
        ? "bg-green-500 text-white border-green-600" 
        : "bg-white text-gray-400 border-gray-200"
    )}>
      {count} / {target}자
    </div>
  );

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' 
  }).format(new Date());

  return (
    <div className="max-w-md mx-auto bg-[#F0F7FF] min-h-screen pb-24 shadow-2xl overflow-hidden relative border-x border-blue-200 font-body">
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

        <Card className="border-2 border-sky-300 bg-[#F0F9FF] rounded-[2.5rem] shadow-md">
          <CardContent className="p-8 text-center italic text-[#0369A1] font-bold text-lg leading-relaxed">
            "{currentVerse.text}"
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-6 bg-[#EC4899] rounded-full" />
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 italic">
              말씀해설 <Sparkles className="w-4 h-4 text-[#22C3C3] animate-pulse" />
            </h3>
          </div>
          <Card className="border-2 border-pink-200 bg-[#FFF1F2] rounded-[2.5rem] shadow-md overflow-hidden">
            <CardContent className="p-7 text-gray-700 font-medium leading-relaxed text-[15px]">
              {!displayCommentary && (isGenerating || isGlobalLoading) ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3 text-muted-foreground animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-400" /> 
                  <span className="font-bold text-sm text-pink-400">말씀을 힙하게 해석하는 중...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-[1.6]">
                  {displayCommentary || "오늘의 말씀을 통해 하나님의 사랑을 느껴보세요!"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#F59E0B] rounded-full" />
                  <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 italic">
                    말씀묵상 <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
                  </h3>
                </div>
              </div>
              <Card className="border-2 border-amber-200 bg-[#FFFBEB] rounded-[2.5rem] shadow-md overflow-hidden">
                <CardContent className="p-7 space-y-6">
                  <div className="space-y-3">
                    <p className="text-[#92400E] font-black text-[15px] leading-snug px-1">
                      {!displayQ1 && (isGenerating || isGlobalLoading) ? "질문을 생각 중..." : `Q1. ${displayQ1 || "말씀을 통해 느낀 점을 적어보세요."}`}
                    </p>
                    <div className="relative">
                      <div className="absolute top-3 right-3 z-10">
                        <CharCount count={reflection.length} target={20} />
                      </div>
                      <Textarea 
                        placeholder="여기에 솔직한 마음을 적어주세요..."
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="bg-white border-2 border-amber-100 rounded-2xl min-h-[140px] p-4 pt-10 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none shadow-inner"
                      />
                    </div>
                  </div>

                  <Separator className="bg-amber-100" />

                  <div className="space-y-3">
                    <p className="text-[#92400E] font-black text-[15px] leading-snug px-1">
                      {!displayQ2 && (isGenerating || isGlobalLoading) ? "다짐을 생각 중..." : `Q2. ${displayQ2 || "오늘 하루 무엇을 실천하고 싶나요?"}`}
                    </p>
                    <div className="relative">
                      <div className="absolute top-3 right-3 z-10">
                        <CharCount count={resolution.length} target={20} />
                      </div>
                      <Textarea 
                        placeholder="오늘 하루 꼭 지킬 한 가지를 적어봐요!"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="bg-white border-2 border-amber-100 rounded-2xl min-h-[140px] p-4 pt-10 text-sm focus-visible:ring-yellow-400 focus-visible:border-yellow-400 placeholder:text-gray-300 resize-none shadow-inner"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-[#8B5CF6] rounded-full" />
                  <h3 className="font-black text-lg text-gray-800 flex items-center gap-2 italic">
                    🙏 오늘의 기도
                  </h3>
                </div>
              </div>
              <Card className="border-2 border-violet-200 bg-[#F5F3FF] rounded-[2.5rem] shadow-md overflow-hidden">
                <CardContent className="p-7 relative">
                  <div className="absolute top-3 right-3 z-10">
                    <CharCount count={prayer.length} target={10} />
                  </div>
                  <Textarea 
                    placeholder="하나님께 드리는 짧은 기도문을 적어보세요..."
                    value={prayer}
                    onChange={(e) => setPrayer(e.target.value)}
                    className="bg-white border-2 border-violet-100 rounded-2xl min-h-[140px] p-4 pt-10 text-sm focus-visible:ring-violet-400 focus-visible:border-violet-400 placeholder:text-gray-300 resize-none shadow-inner"
                  />
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={handleComplete}
              disabled={isGenerating || isGlobalLoading}
              className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#A855F7] to-[#EC4899] font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all mb-4"
            >
              {(!displayCommentary && (isGenerating || isGlobalLoading)) ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-5 h-5 mr-2" />
              )}
              완료하고 50달란트 받기
            </Button>
          </div>
        )}
      </div>

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
