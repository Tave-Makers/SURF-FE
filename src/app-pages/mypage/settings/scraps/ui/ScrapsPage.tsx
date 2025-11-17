'use client';
// TODO : 변경사항 에러 임시 해결, 공지사항 페이지 PR의 최신 ScrapsPage로 변경하기
// import { useInfiniteScraps } from '@/features/post/model/useScraps';
// import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { SCRAPS_EVENTS } from '@/features/post/model/types';
import { trackScrapsEvent } from '@/features/post/lib/trackScrapsEvent';
import { useEffect, useCallback } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { usePageName } from '@/shared/analytics/lib/getPageName';

export default function ScrapsPage() {
  const pageName = usePageName();

  useEffect(() => {
    // 페이지 진입 시 페이지 뷰 로그
    trackScrapsEvent(SCRAPS_EVENTS.VIEW_SCRAPS_PAGE, { page_name: pageName });
  }, [pageName]);

  const handleScrollThreshold = useCallback((percent: number) => {
    trackScrapsEvent(SCRAPS_EVENTS.SCROLL_SCRAPS_PAGE, { percent });
  }, []);

  const scrollRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* TODO : 변경사항 에러 임시 해결, 공지사항 페이지 PR의 최신 ScrapsPage로 변경하기
        <PostListPage
          useInfiniteQueryHook={useInfiniteScraps}
          onPostClick={(post) =>
            trackScrapsEvent(SCRAPS_EVENTS.CLICK_POST_CARD, { post_id: String(post.id) })
          }
          scrollRootRef={scrollRef}
        /> */}
      </div>
    </div>
  );
}
