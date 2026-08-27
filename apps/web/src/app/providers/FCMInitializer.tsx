'use client';

import { isAxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { useRegisterToken } from '@/entities/notification/model/useRegisterToken';
import { getValidStatus } from '@/features/auth/api/getValidStatus';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { getFcmToken } from '@/shared/lib/fcm';
import { isNativeApp, subscribeToNativePushToken } from '@/shared/lib/nativePush';

export const FCMInitializer = () => {
  const { mutate: registerToken } = useRegisterToken();
  const memberId = useAuthStore((s) => s.memberId);
  // 네이티브 토큰은 갱신될 수 있어서 세션 플래그 대신 토큰 값으로 중복을 거른다
  const registeredNativeTokenRef = useRef<string | null>(null);

  useEffect(() => {
    // 로그아웃 상태이거나 로딩 중이면 스킵
    if (!memberId) return;

    function handleUnexpectedError(error: unknown, context: string) {
      if (
        isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[FCMInitializer] User not logged in (Auth failed). Skipping ${context}.`);
        }
        return;
      }

      console.error(`[FCMInitializer] Unexpected error during ${context}:`, error);
    }

    // WebView 는 서비스워커 웹푸시가 동작하지 않는다.
    // 네이티브가 발급해 주입한 FCM 토큰을 그대로 등록한다.
    if (isNativeApp()) {
      return subscribeToNativePushToken((native) => {
        if (registeredNativeTokenRef.current === native.token) return;

        void (async () => {
          try {
            await getValidStatus();

            registeredNativeTokenRef.current = native.token;
            registerToken({ token: native.token, platform: native.platform });
          } catch (error) {
            handleUnexpectedError(error, 'native token registration');
          }
        })();
      });
    }

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
        handleUnexpectedError(error, 'initialization');
      }
    }

    void init();
  }, [memberId, registerToken]);

  return null;
};
