'use client';

import { useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { bylawsData } from '@/app-pages/bylaws/model/data';
import { trackBylawsEvent } from '@/features/bylaws/lib/trackBylawsEvent';
import { BYLAWS_EVENTS } from '@/features/bylaws/model/types';
import { BylawsAccordionGroup } from '@/features/bylaws/ui/BylawsAccordionGroup';
import { usePageName } from '@/shared/analytics/lib/getPageName';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';

const BylawsPage = () => {
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
};

export default BylawsPage;
