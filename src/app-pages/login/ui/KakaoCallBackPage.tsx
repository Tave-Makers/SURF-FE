'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getKakaoLoginCallback } from '@/features/auth/api/getKakaoLoginCallback';

export default function KakaoCallBackPage() {
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

    void (async () => {
      try {
        await getKakaoLoginCallback(code);
        window.location.href = '/';
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
        alert(message);
        router.push('/login');
      }
    })();
  }, [code, router]);

  return <div>로그인 콜백 처리중...</div>;
}
