'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackCommonEvent } from '@/shared/analytics/lib/trackCommonEvent';
import { COMMON_EVENTS } from '@/shared/analytics/model/types';

export const PageTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const mountTime = useRef<number | null>(null);
  const firstActionRecorded = useRef(false);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // 페이지 이동 시점: 이전 페이지 dwell_time 기록
    if (prevPath.current && mountTime.current) {
      const dwell = Date.now() - mountTime.current;
      try {
        trackCommonEvent(COMMON_EVENTS.DWELL_TIME, {
          page_name: prevPath.current,
          dwell_time_ms: dwell,
        });
      } catch (error) {
        console.error('[PageTrackingProvider] DWELL_TIME 로깅 실패:', error);
      }
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
        try {
          trackCommonEvent(COMMON_EVENTS.TIME_TO_FIRST_ACTION, {
            page_name: pathname,
            time_to_first_action_ms: diff,
          });
        } catch (error) {
          console.error('[PageTrackingProvider] TIME_TO_FIRST_ACTION 로깅 실패:', error);
        }
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
};
