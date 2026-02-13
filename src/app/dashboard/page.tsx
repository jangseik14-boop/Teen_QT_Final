"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart2, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { ContentItem, getLocalContent } from "@/lib/content-store";

export default function DashboardPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    setItems(getLocalContent());
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Here's what's happening with your WebCanvas publications.</p>
        </div>
        <Button asChild className="rounded-full shadow-lg">
          <Link href="/editor/new">
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <BarChart2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,840</div>
            <p className="text-xs text-muted-foreground">+18% growth</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">Top 10% of creators</p>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter(i => i.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">Ready to polish</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-headline">Recent Publications</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="group hover:bg-accent/5 transition-colors border-none shadow-sm">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Link href={`/editor/${item.id}`}>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer">{item.title}</CardTitle>
                      </Link>
                      <CardDescription className="flex items-center gap-2">
                        {item.status === 'published' ? 
                          <span className="w-2 h-2 rounded-full bg-green-500" /> : 
                          <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        }
                        {item.status === 'published' ? 'Published' : 'Draft'} • {new Date(item.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/editor/${item.id}`}>Edit</Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
            {items.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                <p className="text-muted-foreground">No publications yet. Start your first masterpiece!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold font-headline">Creative Inspiration</h2>
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-none shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Plus className="w-24 h-24 rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Need an idea?</CardTitle>
              <CardDescription>Use our AI content generator to kickstart your next article.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary/90 hover:bg-primary shadow-lg rounded-full" asChild>
                <Link href="/dashboard/ai">
                  Open AI Assistant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}