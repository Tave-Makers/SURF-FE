'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';

let amplitudeInitialized = false;

export function AnalyticsProvider() {
  const initAmplitude = () => {
    if (!AMPLITUDE_API_KEY || amplitudeInitialized) return;

    // memberId 추가되면 undefined를 memberId로 변경 예정
    amplitude.init(AMPLITUDE_API_KEY, undefined, {
      defaultTracking: {
        pageViews: false,
        sessions: true,
      },
    });
    amplitudeInitialized = true;
  };

  useEffect(() => {
    initAmplitude();
  }, []);

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
