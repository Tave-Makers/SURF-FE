'use client';

import { BylawsAccordionGroup } from '@/features/bylaws/ui/BylawsAccordionGroup';
import { bylawsData } from '@/app-pages/bylaws/model/data';
import { useEffect, useRef } from 'react';
import { trackBylawsEvent } from '@/features/bylaws/lib/trackBylawsEvent';
import { BYLAWS_EVENTS } from '@/features/bylaws/model/types';

export default function BylawsPage() {
  // 페이지뷰 트래킹을 위한 ref
  const trackRef = useRef(false);

  useEffect(() => {
    if (trackRef.current) return;
    trackRef.current = true;
    trackBylawsEvent(BYLAWS_EVENTS.VIEW_RULES_MAIN, { page_name: '회칙 메인' });
  }, []);

  return (
    <div className="flex h-full flex-col overflow-y-auto pt-[1.25rem]">
      <BylawsAccordionGroup accordions={bylawsData} />
    </div>
  );
}
