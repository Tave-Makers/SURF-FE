'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleKakaoLoginCallback } from '@/features/auth/model/authLogic';

export function KakaoCallBackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const didRun = useRef(false);
  useEffect(() => {
    // strict mode 방지용 (1회만 실행)
    if (didRun.current) return;
    didRun.current = true;

    const code = searchParams.get('code');
    if (!code) return;

    const fetchLogin = async () => {
      try {
        const redirectPath = await handleKakaoLoginCallback(code);
        router.push(redirectPath);
      } catch (err) {
        alert((err as Error).message);
        router.push('/login');
      }
    };

    void fetchLogin();
  }, [searchParams, router]);

  return (
    <>
      {/* 추후 로딩 화면 추가 예정 */}
      <div>로그인 처리중...</div>
    </>
  );
}
