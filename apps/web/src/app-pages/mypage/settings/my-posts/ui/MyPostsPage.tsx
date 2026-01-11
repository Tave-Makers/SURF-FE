'use client';

import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { useEffect, useCallback } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { usePageName } from '@/shared/analytics/lib/getPageName';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export default function MyPostsPage() {
  const pageName = usePageName();
  const { memberRole } = useAuthStore();

  const userLevel = memberRole ?? 'member';

  useEffect(() => {
    trackMyPostsEvent(MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE, { page_name: pageName });
  }, [pageName]);

  useEffect(() => {
    sessionStorage.setItem('entry_path', window.location.pathname);
  }, []);

  const handleScrollThreshold = useCallback((percent: number) => {
    trackMyPostsEvent(MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE, { percent });
  }, []);

  const scrollRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-13 pt-13">
        <PostListPage
          useInfiniteQueryHook={useInfiniteMyPosts}
          onPostClick={(post) =>
            trackMyPostsEvent(MY_POSTS_EVENTS.CLICK_POST_CARD, { post_id: String(post.postId) })
          }
          scrollRootRef={scrollRef}
          userLevel={userLevel}
        />
      </div>
    </div>
  );
}
