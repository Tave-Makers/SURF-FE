'use client';

import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { useEffect } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';

export default function MyPostsPage() {
  useEffect(() => {
    // 페이지 진입 시 페이지 뷰 로그
    trackMyPostsEvent(MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE, { page_name: 'my-posts' });
  }, []);

  // ref 콜백 기반 스크롤 트래킹 훅
  const scrollRef = useDynamicScrollTracking<HTMLDivElement>((percent) => {
    trackMyPostsEvent(MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE, { percent });
  });

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <PostListPage useInfiniteQueryHook={useInfiniteMyPosts} />
      </div>
    </div>
  );
}
