'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackCommonEvent } from '@/shared/analytics/lib/trackCommentEvent';
import { COMMON_EVENTS } from '@/shared/analytics/model/types';

export function PageTrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mountTime = useRef<number | null>(null);
  const firstActionRecorded = useRef(false);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // 페이지 이동 시점: 이전 페이지 dwell_time 기록
    if (prevPath.current && mountTime.current) {
      const dwell = Date.now() - mountTime.current;
      trackCommonEvent(COMMON_EVENTS.DWELL_TIME, {
        page_name: prevPath.current, // 이전 페이지 기준으로 기록
        dwell_time_ms: dwell,
      });
    }

    // 새로운 페이지 진입 초기화
    prevPath.current = pathname;
    mountTime.current = Date.now();
    firstActionRecorded.current = false;

    // 현재 페이지에서의 첫 행동 시간 기록
    const handleInteraction = () => {
      if (!firstActionRecorded.current && mountTime.current) {
        firstActionRecorded.current = true;
        const diff = Date.now() - mountTime.current;
        trackCommonEvent(COMMON_EVENTS.TIME_TO_FIRST_ACTION, {
          page_name: pathname,
          time_to_first_action_ms: diff,
        });
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [pathname]);
  return <>{children}</>;
}
