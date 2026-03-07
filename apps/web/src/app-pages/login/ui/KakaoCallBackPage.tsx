'use client';

// import dynamic from 'next/dynamic';
import LoadingCharacter1 from '@surf/ui/assets/loading/character-1.svg';
import LoadingCharacter2 from '@surf/ui/assets/loading/character-2.svg';
import LoadingCharacter3 from '@surf/ui/assets/loading/character-3.svg';
import LoadingCharacter4 from '@surf/ui/assets/loading/character-4.svg';
import LoadingCharacter5 from '@surf/ui/assets/loading/character-5.svg';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getKakaoLoginCallback } from '@/features/auth/api/getKakaoLoginCallback';
import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { PAGE_ROUTES } from '@/shared/config/path';

const characters = [
  LoadingCharacter1,
  LoadingCharacter2,
  LoadingCharacter3,
  LoadingCharacter4,
  LoadingCharacter5,
];

// const CallbackEmpty = dynamic(
//   () => import('@/shared/assets/icons/empty-space/callback-empty.svg'),
//   {
//     ssr: false,
//       loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
//   },
// );

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
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-row items-center">
          {characters.map((Character, i) => (
            <Character
              key={i}
              className="animate-float"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="text-body-body8 text-foreground-tertiary flex items-center gap-2">
          <span className="">잠시만 기다려 주세요</span>
          <span className="animate-dot-appear-1 inline-block">.</span>
          <span className="animate-dot-appear-2 inline-block">.</span>
          <span className="animate-dot-appear-3 inline-block">.</span>
        </div>
      </div>
    </div>
  );
};

export default KakaoCallBackPage;
