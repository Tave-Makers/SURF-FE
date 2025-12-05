'use client';

import { useInfiniteScraps } from '@/features/post/model/useScraps';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { SCRAPS_EVENTS } from '@/features/post/model/types';
import { trackScrapsEvent } from '@/features/post/lib/trackScrapsEvent';
import { useEffect, useCallback } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { usePageName } from '@/shared/analytics/lib/getPageName';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export default function ScrapsPage() {
  const pageName = usePageName();
  const { memberRole } = useAuthStore();

  const userLevel = memberRole ?? 'member';

  useEffect(() => {
    trackScrapsEvent(SCRAPS_EVENTS.VIEW_SCRAPS_PAGE, { page_name: pageName });
  }, [pageName]);

  const handleScrollThreshold = useCallback((percent: number) => {
    trackScrapsEvent(SCRAPS_EVENTS.SCROLL_SCRAPS_PAGE, { percent });
  }, []);

  const scrollRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-13 pt-13">
        <PostListPage
          useInfiniteQueryHook={useInfiniteScraps}
          onPostClick={(post) =>
            trackScrapsEvent(SCRAPS_EVENTS.CLICK_POST_CARD, {
              post_id: String(post.postId),
            })
          }
          scrollRootRef={scrollRef}
          userLevel={userLevel}
        />
      </div>
    </div>
  );
}
