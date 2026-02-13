"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Wand2, PlusCircle, Check } from "lucide-react";
import { generateContentIdeas } from "@/ai/flows/generate-content-ideas";
import { enhanceContentDraft } from "@/ai/flows/enhance-content-draft-flow";
import { toast } from "@/hooks/use-toast";

interface AICommandCenterProps {
  onInsert?: (text: string) => void;
  currentDraft?: string;
}

export function AICommandCenter({ onInsert, currentDraft }: AICommandCenterProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [enhancement, setEnhancement] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    if (!topic) return;
    setLoading(true);
    setEnhancement(null);
    try {
      const { ideas } = await generateContentIdeas({ topic });
      setResults(ideas);
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate ideas.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!currentDraft) {
      toast({ title: "Draft is empty", description: "Write something first!" });
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const { suggestedImprovements } = await enhanceContentDraft({ draftContent: currentDraft });
      setEnhancement(suggestedImprovements);
    } catch (error) {
      toast({ title: "Error", description: "Failed to enhance content.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5 text-accent" />
          AI Studio
        </CardTitle>
        <CardDescription>Generate ideas or improve your current draft.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">What are you thinking about?</Label>
          <div className="flex gap-2">
            <Input 
              id="topic" 
              placeholder="e.g. Sustainable Architecture in 2025" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-background"
            />
            <Button onClick={handleGenerateIdeas} disabled={loading || !topic} size="icon">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full border-accent/30 hover:bg-accent/10" 
            onClick={handleEnhance} 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2 text-accent" />}
            Analyze Current Draft
          </Button>
        </div>

        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Suggested Ideas</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {results.map((idea, i) => (
                <div key={i} className="bg-background p-3 rounded-lg border flex justify-between items-start gap-4 hover:border-accent group transition-all">
                  <span className="text-sm leading-relaxed">{idea}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => onInsert?.(idea)}
                  >
                    <PlusCircle className="w-4 h-4 text-accent" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {enhancement && (
          <div className="mt-4 space-y-2">
             <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">AI Improvements</p>
             <div className="bg-background p-4 rounded-lg border border-accent/50 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                {enhancement}
             </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-[10px] text-muted-foreground text-center w-full">AI can make mistakes. Please review all suggestions before publishing.</p>
      </CardFooter>
    </Card>
  );
}