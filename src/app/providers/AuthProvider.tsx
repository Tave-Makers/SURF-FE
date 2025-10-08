'use client';

import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useAuthHydrated } from '@/features/auth/model/useAuthHydrated';
import { getValidStatus } from '@/features/auth/api/getValidStatus';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, setAuth, clearAuth } = useAuthStore();
  const hydrated = useAuthHydrated();
  const isRedirecting = useRef(false);

  const redirectTo = useCallback(
    (path: string) => {
      if (isRedirecting.current) return;
      isRedirecting.current = true;
      router.replace(path);
    },
    [router],
  );

  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      // 1. 토큰 없으면 로그인 페이지로 이동
      if (!accessToken) {
        redirectTo('/login');
        return;
      }

      try {
        // 2. 유효성 검사 API 호출
        const res = await getValidStatus();
        const { memberId, needOnboarding, memberStatus } = res.data;

        setAuth({ memberId });

        // 3. 온보딩 필요 시
        if (needOnboarding) {
          redirectTo('/onboarding');
          return;
        }

        // 4. 상태별 분기 처리
        switch (memberStatus) {
          case 'REGISTERING':
            redirectTo('/onboarding');
            break;
          case 'WAITING':
            // 추후 가입 대기 페이지로 변경
            redirectTo('/login');
            break;
          case 'APPROVED':
            // 승인된 경우엔 현재 페이지 그대로 렌더링
            redirectTo('/home');
            break;
          case 'REJECTED':
            redirectTo('/login');
            break;
          default:
            redirectTo('/login');
            break;
        }
      } catch (error) {
        console.error('[AuthProvider] auth check failed:', error);
        clearAuth();
        redirectTo('/login');
      }
    };

    void checkAuth();
  }, [hydrated, accessToken, pathname, router, setAuth, clearAuth, redirectTo]);

  if (!hydrated) {
    return <div>로딩중...</div>;
  }

  return <>{children}</>;
}
