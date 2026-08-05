import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { integrateAccount } from '@/features/account-integration/api/integrateAccount';
import { getSocialAccountIntegrationErrorMessage } from '@/features/account-integration/lib/getSocialAccountIntegrationErrorMessage';
import {
  clearPendingSocialAccountIntegration,
  getPendingSocialAccountIntegration,
} from '@/features/account-integration/lib/pendingSocialAccountIntegration';
import { getOAuthOnboarding } from '@/features/auth/api/getOAuthOnboarding';
import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { PAGE_ROUTES } from '@/shared/config/path';

export const useOAuthCallback = () => {
  const router = useRouter();
  const didRun = useRef(false);
  const setOnboarding = useOnboardingStore((s) => s.setOnboarding);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      const pendingIntegration = getPendingSocialAccountIntegration();

      if (pendingIntegration) {
        try {
          await integrateAccount({ integrationToken: pendingIntegration.integrationToken });
          clearPendingSocialAccountIntegration();
          if (cancelled) return;

          openAlert({
            state: 'default',
            title: '기존 계정으로 연동이 완료되었습니다!',
            infoText: '이제 편안하게 SURF를 이용하시면 됩니다.',
            actions: [
              {
                type: 'text',
                variant: 'primary',
                label: '확인',
                onClick: () => {
                  closeAlert({ restoreFocus: false });
                  router.replace(PAGE_ROUTES.HOME);
                },
              },
            ],
          });
        } catch (error) {
          clearPendingSocialAccountIntegration();
          if (cancelled) return;

          console.error('계정 통합 실패:', error);

          openAlert({
            state: 'error',
            title: '연동 실패',
            infoText: getSocialAccountIntegrationErrorMessage(error),
            actions: [
              {
                type: 'text',
                label: '확인',
                onClick: () => {
                  closeAlert({ restoreFocus: false });
                  router.replace(PAGE_ROUTES.LOGIN);
                },
              },
            ],
          });
        }

        return;
      }

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
  }, [router, setOnboarding, openAlert, closeAlert, showToast]);
};
