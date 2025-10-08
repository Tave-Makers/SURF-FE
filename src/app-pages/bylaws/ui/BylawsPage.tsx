'use client';

import { BylawsAccordionGroup } from '@/features/bylaws/ui/BylawsAccordionGroup';
import { bylawsData } from '@/app-pages/bylaws/model/data';
import { useEffect, useRef } from 'react';
import { trackBylawsEvent } from '@/features/bylaws/lib/trackBylawsEvent';
import { BYLAWS_EVENTS } from '@/features/bylaws/model/types';

export default function BylawsPage() {
  // 페이지 진입 트래킹 (최초 1회)
  const trackRef = useRef(false);
  useEffect(() => {
    if (trackRef.current) return;
    trackRef.current = true;
    console.log('📄 페이지 진입 트래킹 전송');
    trackBylawsEvent(BYLAWS_EVENTS.VIEW_RULES_MAIN, { page_name: '회칙 메인' });
  }, []);

  // 스크롤 퍼센트 트래킹
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const THRESHOLDS = [0, 25, 50, 75, 100];
    let sent = new Set<number>();
    let prevScrollHeight = el.scrollHeight;

    // 퍼센트 기준에 도달했을 때 이벤트 전송
    const fire = (t: number) => {
      if (!sent.has(t)) {
        sent.add(t);
        console.log(`🔥 ${t}% 트래킹 이벤트 전송`);
        trackBylawsEvent(BYLAWS_EVENTS.SCROLL_RULES_PAGE, { percent: t });
      }
    };

    // 현재 스크롤 퍼센트 계산
    const getPercent = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return 0;

      const ratio = el.scrollTop / max;
      // 거의 끝까지 내렸다면 강제로 100으로 처리
      if (ratio >= 0.99) return 100;

      return Math.floor((el.scrollTop / max) * 100);
    };

    // 스크롤 시 퍼센트 체크
    const onScroll = () => {
      const p = getPercent();
      THRESHOLDS.forEach((t) => {
        if (p >= t && !sent.has(t)) fire(t);
      });
    };

    // 초기 0% 트래킹
    fire(0);
    el.addEventListener('scroll', onScroll, { passive: true });

    // scrollHeight 변화 감시 (아코디언 열림 등)
    const interval = setInterval(() => {
      const cur = el.scrollHeight;
      if (cur !== prevScrollHeight) {
        console.log('📏 scrollHeight 변경 감지 → baseline 재설정');
        prevScrollHeight = cur;
        const p = getPercent();
        sent = new Set(THRESHOLDS.filter((t) => t <= p));
      }
    }, 1000);

    return () => {
      el.removeEventListener('scroll', onScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div ref={scrollerRef} className="h-full overflow-y-auto pt-[1.25rem]">
      <BylawsAccordionGroup accordions={bylawsData} />
    </div>
  );
}
