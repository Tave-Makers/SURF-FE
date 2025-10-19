// 정적 페이지 스크롤 퍼센트 트래킹 훅
'use client';

import { useCallback, useEffect, useRef } from 'react';

type Options = {
  step?: number; // 임계치 간격(%) — 기본 25 → 0/25/50/75/100
  onStepReach?: (percent: number) => void; // 임계치 도달 시 콜백
  emitInitialZero?: boolean; // 마운트 시 0% 이벤트 전송 여부
};

export function useScrollPercentRef({
  step = 25,
  onStepReach,
  emitInitialZero = true,
}: Options = {}) {
  // 스크롤 대상 요소를 담는 ref (콜백 ref로 설정)
  const elementRef = useRef<HTMLElement | null>(null);
  // 이미 전송한 임계치 퍼센트를 기록하여 중복 전송 방지
  const sentRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // 임계치 기록 초기화 및 초기 0% 전송
    sentRef.current = new Set();
    if (emitInitialZero && !sentRef.current.has(0)) {
      onStepReach?.(0);
      sentRef.current.add(0);
    }

    // 현재 스크롤 위치 대비 문서 높이로 퍼센트 계산
    const getDims = () => ({ top: el.scrollTop, denom: el.scrollHeight - el.clientHeight });

    // 스크롤 이벤트에서 임계치 도달 여부 확인
    const handle = () => {
      const { top, denom } = getDims();

      if (denom <= 0) return; // 스크롤 불가한 경우

      const percent = Math.round((top / denom) * 100);
      const rounded = Math.round(percent / step) * step;

      if (rounded >= 0 && rounded <= 100 && !sentRef.current.has(rounded)) {
        onStepReach?.(rounded);
        sentRef.current.add(rounded);
      }
    };

    el.addEventListener('scroll', handle, { passive: true });
    handle(); // 마운트 직후 현재 위치 기준 1회 계산

    return () => {
      el.removeEventListener('scroll', handle);
    };
  }, [step, onStepReach, emitInitialZero]);

  // 콜백 ref: 요소가 바뀌면 다음 이펙트에서 새 요소 기준으로 다시 바인딩됨
  const refCallback = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return refCallback;
}
