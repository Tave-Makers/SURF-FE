'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useCallback } from 'react';
import { getIntegrationTarget } from '../api/getIntegrationTarget';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

/**
 * 온보딩 제출이 `ACCOUNT_INTEGRATION_REQUIRED`로 실패했을 때의 진입점
 *
 * 통합 대상 프로필을 조회한 뒤 재확인용 바텀시트를 연다.
 * 조회 실패(토큰 만료·대상 없음 등) 시에는 에러 알럿만 노출한다.
 */
export const useAccountIntegrationFlow = () => {
  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const start = useCallback(
    async (integrationToken: string) => {
      try {
        const target = await getIntegrationTarget();

        openBottomSheet({
          type: 'accountIntegration',
          props: { integrationToken, target },
        });
      } catch (error) {
        console.error('통합 대상 조회 실패:', error);

        openAlert({
          state: 'error',
          title: '계정 연동을 진행할 수 없습니다',
          infoText: '기존 계정 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
          actions: [{ type: 'text', label: '확인', onClick: () => closeAlert() }],
        });
      }
    },
    [openBottomSheet, openAlert, closeAlert],
  );

  return { start };
};
