'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useAuthHydrated } from '@/features/auth/model/useAuthHydrated';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (!hydrated) return;

    // 온보딩 구현 후, 온보딩 필요 시 온보딩 페이지로 이동하는 로직 추가 예정
    if (!accessToken) {
      router.replace('/login');
    }
  }, [pathname, accessToken, router, hydrated]);

  if (!hydrated) {
    // 추후 로딩 페이지 추가 예정
    return <div>로딩중...</div>;
  }

  return <>{children}</>;
}
