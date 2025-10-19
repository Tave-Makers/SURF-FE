'use client';

import { useEffect, useRef } from 'react';

/**
 * useScrollTrackingDynamic
 *
 * - 스크롤 퍼센트 기준 임계치(0/25/50/75/100%) 도달 시 콜백 실행
 * - scrollHeight 변화(아코디언 열림 등)에 따라 퍼센트 기준 자동 재계산
 * - 퍼센트 감소 및 재트래킹 정상 작동
 */
export function useDynamicScrollTracking<T extends HTMLElement>(
  onThresholdReach: (percent: number) => void,
) {
  const scrollerRef = useRef<T>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const THRESHOLDS = [0, 25, 50, 75, 100];
    let sent = new Set<number>();
    let prevScrollHeight = el.scrollHeight;

    // 퍼센트 기준 도달 시 이벤트 전송
    const fire = (t: number) => {
      if (!sent.has(t)) {
        sent.add(t);
        if (process.env.NODE_ENV === 'development') {
          console.log(`[scroll-tracking] fire → ${t}%`);
        }
        onThresholdReach(t);
      }
    };

    // 현재 스크롤 퍼센트 계산
    const getPercent = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return 0;

      const ratio = el.scrollTop / max;
      if (ratio >= 0.99) return 100; // 거의 끝까지 내렸다면 강제로 100 처리

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
    // Note: 페이지 높이 변경 시 sent를 재설정하여, 새로운 높이 기준으로 임계치를 다시 트래킹
    const interval = setInterval(() => {
      const cur = el.scrollHeight;
      if (cur !== prevScrollHeight) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[scroll-tracking] scrollHeight changed → ${prevScrollHeight} → ${cur}`);
        }
        prevScrollHeight = cur;
        const p = getPercent();
        sent = new Set(THRESHOLDS.filter((t) => t <= p));
      }
    }, 1000);

    return () => {
      el.removeEventListener('scroll', onScroll);
      clearInterval(interval);
    };
  }, [onThresholdReach]);

  return scrollerRef;
}
