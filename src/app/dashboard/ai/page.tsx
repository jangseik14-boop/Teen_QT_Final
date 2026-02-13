"use client";

import { AICommandCenter } from "@/components/ai/AICommandCenter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, HelpCircle, Lightbulb, PenTool } from "lucide-react";

export default function AIStudioPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          AI Content Studio <Sparkles className="text-accent" />
        </h1>
        <p className="text-muted-foreground">Advanced tools to help you craft better content, faster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AICommandCenter />
          
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">How to use AI Studio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-accent shrink-0" />
                <p className="text-sm">Enter a topic to get structured content outlines and unique angles for your next blog post.</p>
              </div>
              <div className="flex gap-3">
                <PenTool className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm">Use the "Analyze Draft" feature in the editor to get feedback on tone, grammar, and flow.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-accent/5">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Tips for Better Results
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-sm leading-relaxed">
                <p><strong>Be Specific:</strong> Instead of "Cars", try "The transition to electric vehicles in European urban centers."</p>
                <p><strong>Context Matters:</strong> The more text you have in your editor, the better the AI can understand your unique voice and style.</p>
                <p><strong>Iterate:</strong> If the first set of ideas doesn't fit, try tweaking your topic slightly to get a fresh perspective.</p>
             </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 border border-primary/10">
            <h3 className="font-bold mb-2">Pro Feature: Custom Tone</h3>
            <p className="text-sm text-muted-foreground mb-4">Set your brand voice to ensure AI always generates content that sounds like you.</p>
            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-full uppercase font-bold">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}