"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { AICommandCenter } from "@/components/ai/AICommandCenter";
import { ArrowLeft, Save, Globe, Eye, Trash2 } from "lucide-react";
import { addOrUpdateContent, ContentItem, deleteContent, getLocalContent } from "@/lib/content-store";
import { toast } from "@/hooks/use-toast";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    if (!isNew) {
      const items = getLocalContent();
      const item = items.find(i => i.id === id);
      if (item) {
        setTitle(item.title);
        setContent(item.content);
        setStatus(item.status);
      }
    }
  }, [id, isNew]);

  const handleSave = () => {
    const newItem: ContentItem = {
      id: isNew ? Math.random().toString(36).substring(7) : id,
      title: title || "Untitled Article",
      content: content,
      excerpt: content.substring(0, 100),
      author: "Alex River",
      createdAt: new Date().toISOString(),
      status: status,
      imageUrl: `https://picsum.photos/seed/${id}/800/500`
    };
    addOrUpdateContent(newItem);
    toast({ title: "Saved successfully", description: "Your changes are persistent." });
    if (isNew) {
      router.push(`/editor/${newItem.id}`);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this content?")) {
      deleteContent(id);
      router.push("/dashboard");
    }
  };

  const handleInsertAI = (text: string) => {
    setContent(prev => prev + (prev ? "\n\n" : "") + text);
    toast({ title: "Content inserted", description: "AI suggestion added to your draft." });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={() => handleSave()}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={() => { setStatus('published'); handleSave(); }} className="bg-primary hover:bg-primary/90">
            <Globe className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title here..." 
              className="text-3xl md:text-4xl font-bold font-headline border-none px-0 focus-visible:ring-0 placeholder:opacity-50 h-auto py-2 bg-transparent"
            />
            <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
              <EditorToolbar />
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your masterpiece..."
                className="min-h-[600px] border-none focus-visible:ring-0 resize-none p-6 text-lg leading-relaxed font-body"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AICommandCenter onInsert={handleInsertAI} currentDraft={content} />
          
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm capitalize text-primary font-semibold">{status}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Word Count</span>
                <span className="text-sm">{content.split(/\s+/).filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Read Time</span>
                <span className="text-sm">{Math.ceil(content.split(/\s+/).length / 200)} min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sub-component required for Card in this file scope since it was only partially imported or we want cleaner abstractions
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col space-y-1.5 p-6 pb-2">{children}</div>;
}
function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</div>;
}
function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}