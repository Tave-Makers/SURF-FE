'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';

let amplitudeInitialized = false;

export function AnalyticsProvider() {
  const memberId = useAuthStore((s) => s.memberId);

  const initAmplitude = () => {
    if (!AMPLITUDE_API_KEY || amplitudeInitialized) return;
    try {
      // memberId 추가되면 undefined를 memberId로 변경 예정
      amplitude.init(AMPLITUDE_API_KEY, undefined, {
        defaultTracking: {
          pageViews: false,
          sessions: true,
        },
      });
      amplitudeInitialized = true;
    } catch (error) {
      console.error('[Amplitude] 초기화 실패:', error);
    }
  };

  useEffect(() => {
    initAmplitude();
  }, []);

  // memberId 변경 시 Amplitude userId 업데이트
  useEffect(() => {
    if (!amplitudeInitialized) return;
    if (memberId) {
      amplitude.setUserId(`member-${memberId}`);
    } else {
      amplitude.setUserId(undefined);
    }
  }, [memberId]);

  // 페이지 이탈 시점에 안전하게 이벤트 전송
  useEffect(() => {
    const handlePageHide = () => {
      amplitude.setTransport('beacon');
      amplitude.flush();
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  return null;
}
