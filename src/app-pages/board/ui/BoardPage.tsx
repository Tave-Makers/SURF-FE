'use client';

import { useState } from 'react';
import { Tab } from '@/shared/ui/tab/Tab';
import { POST_CATEGORY_LABEL_MAP } from '@/entities/post/model/postCategoryMap';
import { PostList } from '@/widgets/post-list/ui/PostList';
import type { Post, CategoryBadge, PostCategory } from '@/entities/post/model/types';

export const BoardPage = () => {
  const [currentCategory, setCurrentCategory] = useState<PostCategory>('all');
  const categories: CategoryBadge[] = ['event', 'activity', 'partnership', 'patch', 'etc'];

  const dummyPosts: Post[] = Array.from({ length: 10 }).map((_, i) => ({
    postId: i,
    title: `🌟 2025년 제${i + 1}차 부트캠프 일정 안내`,
    content: `Planit Bootcamp에서 진행되는 ${i + 1}번째 세션.`,
    writer: i % 2 === 0 ? '관리자' : '부트캠프 운영팀',
    date: `2025-11-${(i + 10).toString().padStart(2, '0')}`,
    pinned: false,
    isReserved: i % 4 === 0,
    boardId: 1,
    likeCount: Math.floor(Math.random() * 20),
    isLiked: i % 3 === 0,
    scrappedByMe: false,
    scrapCount: 0,
    commentCount: Math.floor(Math.random() * 5),
    category: categories[i % categories.length],
    thumbnailUrl: undefined,
    images: undefined,
  }));

  return (
    <div className="flex h-full w-full flex-col">
      <Tab
        defaultValue="all"
        items={Object.entries(POST_CATEGORY_LABEL_MAP).map(([value, label]) => ({
          value,
          label,
        }))}
        onValueChange={(value) => setCurrentCategory(value as PostCategory)}
      />
      <div className="flex-1 overflow-y-auto">
        <PostList
          posts={dummyPosts}
          currentCategory={currentCategory}
          userLevel="manager"
          showCategoryBadge={true}
        />
      </div>
    </div>
  );
};
