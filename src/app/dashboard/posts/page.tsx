"use client";

import { useEffect, useState } from "react";
import { getLocalContent, ContentItem, deleteContent } from "@/lib/content-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink, MoreVertical } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function MyPostsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    setItems(getLocalContent());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this post?")) {
      deleteContent(id);
      setItems(getLocalContent());
      toast({ title: "Deleted", description: "Post removed from your workspace." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">My Articles</h1>
        <Button asChild>
          <Link href="/editor/new">New Article</Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/editor/${item.id}`}><Edit className="w-4 h-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}