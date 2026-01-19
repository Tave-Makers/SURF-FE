'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { trackScrapsEvent } from '@/features/post/lib/trackScrapsEvent';
import { SCRAPS_EVENTS } from '@/features/post/model/types';
import { useInfiniteScraps } from '@/features/post/model/useScraps';
import { usePageName } from '@/shared/analytics/lib/getPageName';
import ScrapsEmpty from '@/shared/assets/icons/empty-space/scraps-empty.svg';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';

const ScrapsPage = () => {
  const pageName = usePageName();
  const { memberRole } = useAuthStore();

  const userLevel = memberRole ?? 'member';

  useEffect(() => {
    trackScrapsEvent(SCRAPS_EVENTS.VIEW_SCRAPS_PAGE, { page_name: pageName });
  }, [pageName]);

  useEffect(() => {
    sessionStorage.setItem('entry_path', window.location.pathname);
  }, []);

  const handleScrollThreshold = useCallback((percent: number) => {
    trackScrapsEvent(SCRAPS_EVENTS.SCROLL_SCRAPS_PAGE, { percent });
  }, []);

  const scrollRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  const emptyView = (
    <div className="flex h-full flex-col items-center justify-center gap-12">
      <ScrapsEmpty className="h-[4.46rem] w-[4.41rem]" />
      <div className="text-body-body8 text-foreground-tertiary">아직 스크랩한 게시글이 없어요</div>
    </div>
  );

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
          emptyView={emptyView}
        />
      </div>
    </div>
  );
};

export default ScrapsPage;
