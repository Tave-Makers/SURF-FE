'use client';

import { useMutation } from '@tanstack/react-query';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useRouter } from 'next/navigation';
import { integrateAccount } from '../api/integrateAccount';
import { getSocialAccountIntegrationErrorMessage } from '../lib/getSocialAccountIntegrationErrorMessage';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

/**
 * 1회성 통합 토큰으로 계정 통합을 실행한다.
 *
 * 성공 시 바텀시트를 닫고 완료 알럿을 띄우며, 확인 시 로그인 화면으로 이동한다.
 * (통합된 계정으로 다시 로그인해야 하므로 온보딩으로 돌아가지 않는다.)
 */
export const useIntegrateAccount = () => {
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  return useMutation({
    mutationFn: (integrationToken: string) => integrateAccount({ integrationToken }),
    onSuccess: () => {
      closeBottomSheet();

      openAlert({
        state: 'default',
        title: '기존 계정으로 연동이 완료되었습니다!',
        infoText: '이제 연동된 계정을 편하게 사용하시면 됩니다.',
        actions: [
          {
            type: 'text',
            variant: 'primary',
            label: '확인',
            onClick: () => {
              closeAlert({ restoreFocus: false });
              router.replace(PAGE_ROUTES.LOGIN);
            },
          },
        ],
      });
    },
    onError: (error) => {
      // 서버 메시지는 원인을 일부러 감추도록 설계돼 있고(계정 정보 유추 방지)
      // 사용자에게 그대로 노출할 문구가 아니므로, 콘솔에만 남기고 화면에는 자체 문구를 쓴다.
      console.error('계정 통합 실패:', error);

      openAlert({
        state: 'error',
        title: '연동 실패',
        infoText: getSocialAccountIntegrationErrorMessage(error),
        actions: [{ type: 'text', label: '확인', onClick: () => closeAlert() }],
      });
    },
  });
};
