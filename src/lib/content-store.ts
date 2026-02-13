"use client";

export type ContentItem = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  status: 'draft' | 'published';
  imageUrl?: string;
};

const STORAGE_KEY = 'webcanvas_content_items';

export function getLocalContent(): ContentItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults: ContentItem[] = [
      {
        id: '1',
        title: 'The Future of Web Design',
        content: 'Exploration of how AI and spatial computing are reshaping the digital landscape...',
        excerpt: 'Exploration of how AI and spatial computing are reshaping the digital landscape...',
        author: 'Alex River',
        createdAt: new Date().toISOString(),
        status: 'published',
        imageUrl: 'https://picsum.photos/seed/future/800/500'
      },
      {
        id: '2',
        title: 'Sustainable Engineering Practices',
        content: 'How modern software engineering is adapting to environmental needs...',
        excerpt: 'How modern software engineering is adapting to environmental needs...',
        author: 'Alex River',
        createdAt: new Date().toISOString(),
        status: 'published',
        imageUrl: 'https://picsum.photos/seed/eco/800/500'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
}

export function saveLocalContent(items: ContentItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addOrUpdateContent(item: ContentItem) {
  const items = getLocalContent();
  const index = items.findIndex(i => i.id === item.id);
  if (index > -1) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  saveLocalContent(items);
}

export function deleteContent(id: string) {
  const items = getLocalContent();
  const filtered = items.filter(i => i.id !== id);
  saveLocalContent(filtered);
}