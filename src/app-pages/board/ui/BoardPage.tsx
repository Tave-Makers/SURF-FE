'use client';

import { useState } from 'react';
import { Tab } from '@/shared/ui/tab/Tab';
import { TAB_CATEGORIES } from '@/entities/post/model/constants';
import { PostList } from '@/widgets/post-list/ui/PostList';
import type { Post } from '@/entities/post/model/types';
import type { TabCategoryLabel, PostCategoryLabel } from '@/entities/post/model/constants';

export const BoardPage = () => {
  // 🔥 탭 카테고리는 '전체' 포함
  const [currentCategory, setCurrentCategory] = useState<TabCategoryLabel>('전체');

  // 🔥 dummy posts (게시글 category는 "전체" 불가)
  const realCategories = ['행사', '활동', '제휴', '패치', '기타'] as PostCategoryLabel[];

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

    // 🔥 게시글은 실카테고리만 가짐
    categoryName: realCategories[i % realCategories.length],

    thumbnailUrl: undefined,
    images: undefined,
  }));

  return (
    <div className="flex h-full w-full flex-col">
      <Tab
        defaultValue="전체"
        items={TAB_CATEGORIES.map((c) => ({
          value: c.label, // "전체" | "행사" | ...
          label: c.label,
        }))}
        onValueChange={(value) => setCurrentCategory(value as TabCategoryLabel)}
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
