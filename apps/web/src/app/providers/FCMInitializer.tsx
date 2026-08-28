'use client';

import { isAxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { useRegisterToken } from '@/entities/notification/model/useRegisterToken';
import { getValidStatus } from '@/features/auth/api/getValidStatus';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { getFcmToken } from '@/shared/lib/fcm';
import { isNativeApp, subscribeToNativePushToken } from '@/shared/lib/nativePush';

export const FCMInitializer = () => {
  const { mutate: registerToken, mutateAsync: registerTokenAsync } = useRegisterToken();
  const memberId = useAuthStore((s) => s.memberId);
  // 네이티브 토큰은 갱신될 수 있어서 세션 플래그 대신 토큰 값으로 중복을 거른다.
  // 기기 토큰은 계정이 바뀌어도 같으므로 memberId 까지 묶어야 한다 —
  // 토큰만 보면 A 로그아웃 후 로그인한 B 의 등록이 스킵되고, 서버에 남은 매핑 탓에
  // B 의 기기가 A 의 알림을 받게 된다.
  const registeredNativeKeyRef = useRef<string | null>(null);

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
      // 계정이 바뀌거나 언마운트되면 진행 중이던 등록의 뒷정리를 막는다
      let active = true;
      // await 하는 동안 같은 토큰 이벤트가 또 와도 중복 요청하지 않는다
      const inFlight = new Set<string>();

      const unsubscribe = subscribeToNativePushToken((native) => {
        const key = `${memberId}:${native.token}`;
        if (registeredNativeKeyRef.current === key || inFlight.has(key)) return;

        inFlight.add(key);

        void (async () => {
          try {
            await getValidStatus();
            if (!active) return;

            // mutate 는 결과를 알 수 없어 실패해도 성공으로 기록된다.
            // 등록이 확정된 뒤에 기록해야 실패 시 다음 이벤트에서 재시도된다.
            await registerTokenAsync({ token: native.token, platform: native.platform });
            if (!active) return;

            registeredNativeKeyRef.current = key;
          } catch (error) {
            if (active) handleUnexpectedError(error, 'native token registration');
          } finally {
            inFlight.delete(key);
          }
        })();
      });

      return () => {
        active = false;
        unsubscribe();
      };
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
  }, [memberId, registerToken, registerTokenAsync]);

  return null;
};
