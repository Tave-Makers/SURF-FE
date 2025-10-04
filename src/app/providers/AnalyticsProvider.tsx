'use client';

import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';

let amplitudeInitialized = false;

export function AnalyticsProvider() {
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

  return null;
}
