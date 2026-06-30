import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { getOAuthOnboarding } from '@/features/auth/api/getOAuthOnboarding';
import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { PAGE_ROUTES } from '@/shared/config/path';

export const useOAuthCallback = () => {
  const router = useRouter();
  const didRun = useRef(false);
  const setOnboarding = useOnboardingStore((s) => s.setOnboarding);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      try {
        const { nickname, email, profileImageUrl } = await getOAuthOnboarding(controller.signal);
        if (cancelled) return;
        setOnboarding({ nickname, email, profileImageUrl });
        router.replace(PAGE_ROUTES.HOME);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : '로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
        showToast(message);
        router.replace(PAGE_ROUTES.LOGIN);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [router, setOnboarding, showToast]);
};
