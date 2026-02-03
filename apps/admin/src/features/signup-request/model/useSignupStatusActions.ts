'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useUpdateSignupRequestStatusMutation } from './useUpdateRequestStatusMutation';
import type { SignupRequestFilters } from './queries/signupRequestQueryKeys';

/** 가입 신청 상태 변경 타입 */
export type SignupStatusAction = 'approve' | 'reject';

/** Alert 설정 타입 */
type AlertConfig = {
  title: string;
  getInfoText: (count: number) => string;
  variant: 'primary' | 'danger';
  label: string;
};

/** 승인/거절 Alert 설정 */
const ALERT_CONFIGS: Record<SignupStatusAction, AlertConfig> = {
  approve: {
    title: '회원 가입을 승인하시겠습니까?',
    getInfoText: (count) =>
      count === 1
        ? '승인 버튼을 누를 시, 해당 인원의 회원가입을 승인합니다.'
        : `승인 버튼을 누를 시, 선택한 ${count}명의 인원의 회원가입을 승인합니다.`,
    variant: 'primary',
    label: '승인하기',
  },
  reject: {
    title: '회원 가입을 거절하시겠습니까?',
    getInfoText: (count) =>
      count === 1
        ? '거절 버튼을 누를 시, 해당 인원의 회원가입이 거절됩니다.'
        : `거절 버튼을 누를 시, 선택한 ${count}명의 인원의 회원가입이 거절됩니다.`,
    variant: 'danger',
    label: '거절하기',
  },
};

type UseSignupStatusActionsParams = {
  /** 상태 변경 대상 회원 ID 목록 */
  memberIds: number[];
  /** 목록 필터 (캐시 업데이트용) */
  filters?: SignupRequestFilters;
  /** 상태 변경 성공 시 콜백 */
  onSuccess?: () => void;
};

/**
 * 가입 신청 승인/거절 액션을 제공하는 훅
 * @description Alert 표시 및 상태 변경 mutation을 처리합니다.
 */
export const useSignupStatusActions = ({
  memberIds,
  filters,
  onSuccess,
}: UseSignupStatusActionsParams) => {
  const { mutate, isPending } = useUpdateSignupRequestStatusMutation();

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showErrorToast = useToastStore((s) => s.show);

  /**
   * 가입 신청 상태를 변경합니다.
   * @param action - 수행할 액션 ('approve' | 'reject')
   */
  const handleStatusChange = (action: SignupStatusAction) => {
    if (isPending || memberIds.length === 0) return;

    mutate(
      {
        memberIds,
        nextStatus: action,
        filters,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          showErrorToast(error.message);
        },
      },
    );
  };

  /**
   * 승인/거절 확인 Alert를 엽니다.
   * @param action - 수행할 액션 ('approve' | 'reject')
   */
  const openStatusAlert = (action: SignupStatusAction) => {
    const config = ALERT_CONFIGS[action];

    openAlert({
      state: 'default',
      title: config.title,
      infoText: config.getInfoText(memberIds.length),
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: closeAlert,
        },
        {
          type: 'solid',
          variant: config.variant,
          label: config.label,
          onClick: () => {
            closeAlert();
            handleStatusChange(action);
          },
        },
      ],
    });
  };

  return {
    /** 승인 Alert 열기 */
    openApproveAlert: () => openStatusAlert('approve'),
    /** 거절 Alert 열기 */
    openRejectAlert: () => openStatusAlert('reject'),
    /** mutation 진행 중 여부 */
    isPending,
  };
};
