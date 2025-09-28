'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { getValidStatus } from '@/features/auth/api/getValidStatus';

export default function RootPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const checkStatus = async () => {
      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        const res = await getValidStatus();
        if (res.data) {
          router.replace('/onboarding');
        } else {
          router.replace('/home');
        }
      } catch {
        router.replace('/login'); // 토큰 만료 or API 에러
      }
    };

    void checkStatus();
  }, [accessToken, router]);

  return <div>로딩중...</div>;
}
