'use client';

import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { useEffect, useCallback } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { usePageName } from '@/shared/analytics/lib/getPageName';

export default function MyPostsPage() {
  const pageName = usePageName();

  useEffect(() => {
    // 페이지 진입 시 페이지 뷰 로그
    trackMyPostsEvent(MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE, { page_name: pageName });
  }, [pageName]);

  const handleScrollThreshold = useCallback((percent: number) => {
    trackMyPostsEvent(MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE, { percent });
  }, []);

  const scrollRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <PostListPage
          useInfiniteQueryHook={useInfiniteMyPosts}
          onPostClick={(post) =>
            trackMyPostsEvent(MY_POSTS_EVENTS.CLICK_POST_CARD, { post_id: String(post.id) })
          }
          scrollRootRef={scrollRef}
        />
      </div>
    </div>
  );
}
