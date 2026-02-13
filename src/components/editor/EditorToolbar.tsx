"use client";

import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function EditorToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 rounded-t-lg border-b">
      <div className="flex items-center gap-1 mr-2">
        <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="w-4 h-4" /></Button>
      </div>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex items-center gap-1 mx-2">
        <Button variant="ghost" size="icon" className="h-8 w-8"><Heading1 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><Heading2 className="w-4 h-4" /></Button>
      </div>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex items-center gap-1 mx-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-accent/10"><Bold className="w-4 h-4 text-primary" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
      </div>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex items-center gap-1 mx-2">
        <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><Quote className="w-4 h-4" /></Button>
      </div>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="h-8 w-8"><LinkIcon className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}