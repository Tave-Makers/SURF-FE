'use client';

import LoadingCharacter1 from '@surf/ui/assets/loading/character-1.svg';
import LoadingCharacter2 from '@surf/ui/assets/loading/character-2.svg';
import LoadingCharacter3 from '@surf/ui/assets/loading/character-3.svg';
import LoadingCharacter4 from '@surf/ui/assets/loading/character-4.svg';
import LoadingCharacter5 from '@surf/ui/assets/loading/character-5.svg';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { PAGE_ROUTES } from '@/shared/config/path';

const characters = [
  LoadingCharacter1,
  LoadingCharacter2,
  LoadingCharacter3,
  LoadingCharacter4,
  LoadingCharacter5,
];

const AppleCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const didRun = useRef(false);
  const setOnboarding = useOnboardingStore((s) => s.setOnboarding);
  const showToast = useToastStore((s) => s.show);

  const email = searchParams.get('email');
  const nickname = searchParams.get('nickname') ?? '';
  const profileImageUrl = searchParams.get('profileImageUrl') ?? '';

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!email) {
      showToast('잘못된 접근이에요. 다시 로그인해주세요.');
      router.push(PAGE_ROUTES.LOGIN);
      return;
    }

    setOnboarding({ nickname, email, profileImageUrl });
    router.push(PAGE_ROUTES.HOME);
  }, [email, nickname, profileImageUrl, router, setOnboarding, showToast]);

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
          <span>잠시만 기다려 주세요</span>
          <span className="animate-dot-appear-1 inline-block">.</span>
          <span className="animate-dot-appear-2 inline-block">.</span>
          <span className="animate-dot-appear-3 inline-block">.</span>
        </div>
      </div>
    </div>
  );
};

export default AppleCallbackPage;
