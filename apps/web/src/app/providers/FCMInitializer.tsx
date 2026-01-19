'use client';

import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { useRegisterToken } from '@/entities/notification/model/useRegisterToken';
import { getValidStatus } from '@/features/auth/api/getValidStatus';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { getFcmToken } from '@/shared/lib/fcm';

export const FCMInitializer = () => {
  const { mutate: registerToken } = useRegisterToken();
  const memberId = useAuthStore((s) => s.memberId);

  useEffect(() => {
    // 로그아웃 상태이거나 로딩 중이면 스킵
    if (!memberId) return;

    async function init() {
      try {
        // 1. 로그인 상태 확인
        await getValidStatus();

        // 2. 이미 등록되었다면 스킵
        const isRegistered = sessionStorage.getItem('isFcmRegistered');
        if (isRegistered === 'true') {
          if (process.env.NODE_ENV === 'development') {
            console.log('[FCMInitializer] Token already registered in session. Skipping.');
          }
          return;
        }

        // 3. FCM 토큰 발급 및 권한 요청
        const token = await getFcmToken();

        if (!token) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[FCMInitializer] Failed to get FCM token.');
          }
          return;
        }

        // 4. 서버에 토큰 등록
        registerToken({ token, platform: 'WEB' });
      } catch (error) {
        if (
          isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[FCMInitializer] User not logged in (Auth failed). Skipping FCM.');
          }
        } else {
          console.error('[FCMInitializer] Unexpected error during initialization:', error);
        }
      }
    }

    void init();
  }, [memberId, registerToken]);

  return null;
};
