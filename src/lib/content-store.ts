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
  tags?: string[];
};

const STORAGE_KEY = 'vibeword_meditations';

export function getLocalContent(): ContentItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults: ContentItem[] = [
      {
        id: '1',
        title: '세상의 시선에서 자유로워지는 법',
        content: '요즘 인스타 보면 다들 나보다 잘 사는 것 같지? 하지만 하나님은 네 존재 자체로 힙하다고 하셔...',
        excerpt: '사람들의 좋아요가 아닌 하나님의 사랑에 집중해봐.',
        author: 'Holy Vibes AI',
        createdAt: new Date().toISOString(),
        status: 'published',
        imageUrl: 'https://picsum.photos/seed/vibe1/800/500',
        tags: ['Mental', 'Self-love']
      },
      {
        id: '2',
        title: '불안한 미래, 내비게이션 켜기',
        content: '공부, 진로, 관계... 앞이 안 보일 때 시편 말씀을 묵상해보면...',
        excerpt: '내 발의 등불이 되어주시는 주님을 따라가보자.',
        author: 'Vibe Master',
        createdAt: new Date().toISOString(),
        status: 'published',
        imageUrl: 'https://picsum.photos/seed/vibe2/800/500',
        tags: ['Future', 'Goal']
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