'use client';

import { useInfiniteScraps } from '@/features/post/model/useScraps';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { SCRAPS_EVENTS } from '@/features/post/model/types';
import { trackScrapsEvent } from '@/features/post/lib/trackScrapsEvent';
import { useEffect, useCallback } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { usePageName } from '@/shared/analytics/lib/getPagename';

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
        <PostListPage useInfiniteQueryHook={useInfiniteScraps} />
      </div>
    </div>
  );
}
