'use client';

import { useInfiniteScraps } from '@/features/post/model/useScraps';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';
import { SCRAPS_EVENTS } from '@/features/post/model/types';
import { trackScrapsEvent } from '@/features/post/lib/trackScrapsEvent';
import { useEffect } from 'react';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';

export default function ScrapsPage() {
  useEffect(() => {
    // 페이지 진입 시 페이지 뷰 로그
    trackScrapsEvent(SCRAPS_EVENTS.VIEW_SCRAPS_PAGE, { page_name: 'scraps' });
  }, []);

  // ref 콜백 기반 스크롤 트래킹 훅
  const scrollRef = useDynamicScrollTracking<HTMLDivElement>((percent) => {
    trackScrapsEvent(SCRAPS_EVENTS.SCROLL_SCRAPS_PAGE, { percent });
  });

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <PostListPage useInfiniteQueryHook={useInfiniteScraps} />
      </div>
    </div>
  );
}
