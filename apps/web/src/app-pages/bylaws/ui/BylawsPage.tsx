'use client';

import { BylawsAccordionGroup } from '@/features/bylaws/ui/BylawsAccordionGroup';
import { bylawsData } from '@/app-pages/bylaws/model/data';
import { useEffect, useRef } from 'react';
import { trackBylawsEvent } from '@/features/bylaws/lib/trackBylawsEvent';
import { BYLAWS_EVENTS } from '@/features/bylaws/model/types';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { useCallback } from 'react';
import { usePageName } from '@/shared/analytics/lib/getPageName';

export default function BylawsPage() {
  // 페이지 진입 트래킹 (최초 1회)
  const trackRef = useRef(false);
  const pageName = usePageName();

  useEffect(() => {
    if (trackRef.current) return;
    trackRef.current = true;
    trackBylawsEvent(BYLAWS_EVENTS.VIEW_RULES_MAIN, { page_name: pageName });
  }, [pageName]);

  // 스크롤 퍼센트 트래킹
  const handleScrollThreshold = useCallback((percent: number) => {
    trackBylawsEvent(BYLAWS_EVENTS.SCROLL_RULES_PAGE, { percent });
  }, []);

  const scrollerRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  return (
    <main
      ref={scrollerRef}
      className="h-full overflow-y-auto pt-15"
      role="main"
      aria-label="회칙 목록"
    >
      <BylawsAccordionGroup accordions={bylawsData} />
    </main>
  );
}
