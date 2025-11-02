'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleKakaoLoginCallback } from '@/features/auth/model/authLogic';

export function KakaoCallBackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const didRun = useRef(false);

  const code = searchParams.get('code');

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!code) {
      alert('잘못된 접근이에요. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }

    const fetchLogin = async () => {
      try {
        const redirectPath = await handleKakaoLoginCallback(code);
        router.replace(redirectPath);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
        alert(message);

        router.push('/login');
      }
    };

    void fetchLogin();
  }, [code, router]);

  return <div>로그인 처리중...</div>;
}
