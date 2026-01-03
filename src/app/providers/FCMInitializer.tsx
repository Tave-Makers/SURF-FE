'use client';

import { useEffect } from 'react';
import { getFcmToken } from '@/shared/lib/fcm';
import { getValidStatus } from '@/features/auth/api/getValidStatus';

export default function FCMInitializer() {
  useEffect(() => {
    async function init() {
      try {
        // 1. 로그인 상태 확인 (API 호출)
        await getValidStatus();

        // 2. 로그인 성공 시에만 FCM 토큰 발급 및 권한 요청
        if (process.env.NODE_ENV === 'development') {
          console.log('[FCMInitializer] User is logged in. Requesting FCM token...');
        }

        const token = await getFcmToken();
        if (token) {
          if (process.env.NODE_ENV === 'development') {
            console.log('FCM Initialized with token:', token);
          }
        }
      } catch (error) {
        // 401, 403 등 로그인 실패 시 아무것도 하지 않음
        if (process.env.NODE_ENV === 'development') {
          console.log('[FCMInitializer] User not logged in or auth failed.', error);
        }
      }
    }

    void init();
  }, []);

  return null;
}
