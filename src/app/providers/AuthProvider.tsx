'use client';

import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useAuthHydrated } from '@/features/auth/model/useAuthHydrated';
import { getValidStatus } from '@/features/auth/api/getValidStatus';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, setAuth, clearAuth } = useAuthStore();
  const hydrated = useAuthHydrated();

  // 중복 이동 방지용 리다이렉트 상태
  const isRedirecting = useRef(false);

  // 리다이렉트 동작 수행
  const redirectRef = useRef<(path: string) => void>(() => {});
  redirectRef.current = (path: string) => {
    if (pathname === path || isRedirecting.current) return;
    isRedirecting.current = true;
    router.replace(path);
  };

  // 경로 변경 시 리다이렉트 상태 초기화
  useEffect(() => {
    isRedirecting.current = false;
  }, [pathname]);

  const redirectRules = useMemo(
    () => ({
      REGISTERING: () => '/onboarding',
      WAITING: () => '/login',
      REJECTED: () => '/login',
      APPROVED: (path: string) => (path === '/' || path === '/onboarding' ? '/home' : null),
    }),
    [],
  );

  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      // 1. 토큰이 없으면 로그인 페이지로 이동
      if (!accessToken) {
        if (pathname !== '/login') redirectRef.current('/login');
        return;
      }

      try {
        // 2. 유효성 검사 API 호출
        const res = await getValidStatus();
        const { memberId, needOnboarding, memberStatus } = res.data;
        setAuth({ memberId });

        // 3. 온보딩이 필요한 경우
        if (needOnboarding && pathname !== '/onboarding') {
          redirectRef.current('/onboarding');
          return;
        }

        // 4. 상태별 리다이렉트 처리
        const target = redirectRules[memberStatus]?.(pathname);
        if (target && pathname !== target) redirectRef.current(target);
      } catch (err) {
        console.error('[AuthProvider] auth check failed:', err);
        clearAuth();
        if (pathname !== '/login') redirectRef.current('/login');
      }
    };

    void checkAuth();
  }, [hydrated, accessToken, pathname, router, setAuth, clearAuth, redirectRules]);

  if (!hydrated) return <div>로딩중...</div>;
  return <>{children}</>;
}
