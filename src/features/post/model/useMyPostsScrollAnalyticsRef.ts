'use client';

import { useScrollPercentRef } from '@/features/post/lib/useScrollPercentRef';
import { useCallback } from 'react';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';

export function useMyPostsScrollAnalyticsRef() {
  const onStepReach = useCallback((percent: number) => {
    console.log(`[내 게시물 목록 스크롤 로그]: ${percent}% 지점 도달 로그 전송`);

    trackMyPostsEvent(MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE, { percent });
  }, []);

  return useScrollPercentRef({ step: 25, onStepReach, emitInitialZero: true });
}
