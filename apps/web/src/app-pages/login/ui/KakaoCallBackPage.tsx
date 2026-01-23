'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getKakaoLoginCallback } from '@/features/auth/api/getKakaoLoginCallback';
import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { PAGE_ROUTES } from '@/shared/config/path';

const CallbackEmpty = dynamic(
  () => import('@/shared/assets/icons/empty-space/callback-empty.svg'),
  {
    ssr: false,
  },
);

const KakaoCallBackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const didRun = useRef(false);
  const setOnboarding = useOnboardingStore((s) => s.setOnboarding);

  const code = searchParams.get('code');

  useEffect(() => {
    if (didRun.current) {
      return;
    }
    didRun.current = true;

    if (!code) {
      alert('잘못된 접근이에요. 다시 로그인해주세요.');
      router.push(PAGE_ROUTES.LOGIN);
      return;
    }

    void (async () => {
      try {
        const response = await getKakaoLoginCallback(code);

        if (!response?.data) {
          throw new Error('로그인 응답이 비어있어요.');
        }

        const { nickname, email, profileImageUrl } = response.data;

        setOnboarding({
          nickname,
          email,
          profileImageUrl,
        });

        router.push(PAGE_ROUTES.HOME);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
        alert(message);
        router.push(PAGE_ROUTES.LOGIN);
      }
    })();
  }, [code, router, setOnboarding]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-[0.625rem]">
        <CallbackEmpty className="h-[3.54325rem] w-[16.3125rem]" />
        <span className="text-body-body8 text-foreground-tertiary">잠시만 기다려 주세요...</span>
      </div>
    </div>
  );
};

export default KakaoCallBackPage;
