'use client';

import { useEffect, useRef } from 'react';
import { getFcmToken } from '@/shared/lib/fcm';
import { getValidStatus } from '@/features/auth/api/getValidStatus';
import { useRegisterToken } from '@/entities/notification/model/useRegisterToken';
import { isAxiosError } from 'axios';

export default function FCMInitializer() {
  const { mutate: registerToken } = useRegisterToken();
  const initRef = useRef(false);

  useEffect(
    () => {
      if (initRef.current) return;
      initRef.current = true;

      async function init() {
        try {
          // 1. 로그인 상태 확인 (API 호출)
          await getValidStatus();

          // 2. 이미 등록되었다면 스킵
          const isRegistered = sessionStorage.getItem('isFcmRegistered');
          if (isRegistered === 'true') {
            if (process.env.NODE_ENV === 'development') {
              console.log('[FCMInitializer] Token already registered in session. Skipping.');
            }
            return;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('[FCMInitializer] User is logged in. Requesting FCM token...');
          }

          // 2. FCM 토큰 발급 및 권한 요청
          const token = await getFcmToken();

          if (!token) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[FCMInitializer] Failed to get FCM token or permission denied.');
            }
            return;
          }

          // 3. 서버에 토큰 등록
          if (process.env.NODE_ENV === 'development') {
            console.log('[FCMInitializer] Registering token to server');
          }

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
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  ); // 한 번만 실행 보장

  return null;
}
