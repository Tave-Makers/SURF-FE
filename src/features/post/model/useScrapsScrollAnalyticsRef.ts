'use client';

import { useScrollPercentRef } from '@/features/post/lib/useScrollPercentRef';
import { useCallback } from 'react';
import { trackScrapsEvent } from '@/features/post/lib/trackScrapsEvent';
import { SCRAPS_EVENTS } from '@/features/post/model/types';

export function useScrapsScrollAnalyticsRef() {
  const onStepReach = useCallback((percent: number) => {
    console.log(`[스크랩 목록 스크롤 로그]: ${percent}% 지점 도달 로그 전송`);

    trackScrapsEvent(SCRAPS_EVENTS.SCROLL_SCRAPS_PAGE, { percent });
  }, []);

  return useScrollPercentRef({ step: 25, onStepReach, emitInitialZero: true });
}
