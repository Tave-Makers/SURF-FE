'use client';

import { useEffect, useRef, useState } from 'react';

export interface DebouncedValueOptions {
  /** 첫 변경 시 즉시 반영 (기본: false) */
  leading?: boolean;
  /** 최대 대기 시간 - 이 시간이 지나면 강제 반영 */
  maxWait?: number;
}

/**
 * 값의 변경을 디바운스하여 반환하는 훅
 *
 * @param value - 디바운스할 값
 * @param delay - 디바운스 지연 시간 (ms, 기본: 300)
 * @param options - 디바운스 옵션
 * @returns 디바운스된 값
 *
 * @example
 * // 기본 사용 (trailing)
 * const debouncedKeyword = useDebouncedValue(keyword, 300);
 *
 * @example
 * // 첫 입력 즉시 반영
 * const debouncedKeyword = useDebouncedValue(keyword, 300, { leading: true });
 *
 * @example
 * // 연속 입력해도 2초마다 중간 결과 반영
 * const debouncedKeyword = useDebouncedValue(keyword, 300, { maxWait: 2000 });
 */
export function useDebouncedValue<T>(
  value: T,
  delay = 300,
  options: DebouncedValueOptions = {},
): T {
  const { leading = false, maxWait } = options;

  const [debouncedValue, setDebouncedValue] = useState(value);
  const isFirstRender = useRef<boolean>(true);
  const lastUpdateTime = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 첫 렌더링 시 leading 옵션 처리
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (leading) {
        setDebouncedValue(value);
        lastUpdateTime.current = Date.now();
      }
      return;
    }

    // leading: 값이 변경되고 이전 타이머가 없으면 즉시 반영
    if (leading && !timeoutRef.current) {
      setDebouncedValue(value);
      lastUpdateTime.current = Date.now();
    }

    // 기존 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // maxWait 처리
    if (maxWait && !maxWaitTimeoutRef.current) {
      const elapsed = Date.now() - lastUpdateTime.current;
      const remainingMaxWait = Math.max(0, maxWait - elapsed);

      maxWaitTimeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        lastUpdateTime.current = Date.now();
        maxWaitTimeoutRef.current = null;

        // trailing 타이머도 정리
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }, remainingMaxWait);
    }

    // trailing 타이머 설정
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      lastUpdateTime.current = Date.now();
      timeoutRef.current = null;

      // maxWait 타이머 정리
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
        maxWaitTimeoutRef.current = null;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, [value, delay, leading, maxWait]);

  return debouncedValue;
}
