'use client';

import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { useEffect } from 'react';
import { useMyPostsScrollAnalyticsRef } from '@/features/post/model/useMyPostsScrollAnalyticsRef';

export default function MyPostsPage() {
  useEffect(() => {
    // 페이지 진입 시 페이지 뷰 로그
    trackMyPostsEvent(MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE, { page_name: 'my-posts' });
  }, []);

  // ref 콜백 기반 스크롤 트래킹 훅
  const scrollRef = useMyPostsScrollAnalyticsRef();

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <PostListPage useInfiniteQueryHook={useInfiniteMyPosts} />
      </div>
    </div>
  );
}
