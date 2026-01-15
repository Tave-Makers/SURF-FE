'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getKakaoLoginCallback } from '@/features/auth/api/getKakaoLoginCallback';
import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { PAGE_ROUTES } from '@/shared/config/path';
import { axiosInstance } from '@/shared/lib/axiosInstance';

const KakaoCallBackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const didRun = useRef(false);
  const setOnboarding = useOnboardingStore((s) => s.setOnboarding);

  const code = searchParams.get('code');

  // 렌더 단계 로그
  console.log('[KAKAO][CALLBACK] render');
  console.log('[KAKAO][CALLBACK] code from query =', code);

  useEffect(() => {
    console.log('[KAKAO][CALLBACK] useEffect entered');

    if (didRun.current) {
      console.log('[KAKAO][CALLBACK] already ran -> skip');
      return;
    }
    didRun.current = true;

    if (!code) {
      console.error('[KAKAO][CALLBACK] code is null');
      alert('잘못된 접근이에요. 다시 로그인해주세요.');
      router.push(PAGE_ROUTES.LOGIN);
      return;
    }

    console.log('[KAKAO][CALLBACK] code exists, start backend call');

    void (async () => {
      try {
        console.log('[KAKAO][CALLBACK] -> calling getKakaoLoginCallback');
        const response = await getKakaoLoginCallback(code);

        console.log('[KAKAO][CALLBACK] <- backend response', response);

        const { accessToken, nickname, email, profileImageUrl } = response.data;

        console.log('[KAKAO][CALLBACK] accessToken', accessToken);

        // axios 전역 Authorization 헤더 세팅
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        console.log('[KAKAO][CALLBACK] Authorization header set');

        setOnboarding({
          nickname,
          email,
          profileImageUrl,
        });

        console.log('[KAKAO][CALLBACK] onboarding set -> move HOME');
        router.push(PAGE_ROUTES.HOME);
      } catch (err) {
        console.error('[KAKAO][CALLBACK] error during login', err);

        const message =
          err instanceof Error
            ? err.message
            : '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
        alert(message);
        router.push(PAGE_ROUTES.LOGIN);
      }
    })();
  }, [code, router, setOnboarding]);

  return <div>로그인 콜백 처리중...</div>;
};

export default KakaoCallBackPage;
