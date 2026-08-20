'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';

import { UNBLOCK_CONFIRM_INFO_TEXT, UNBLOCK_CONFIRM_TITLE } from './constants';
import { useUnblockMemberMutation } from './useUnblockMemberMutation';

/** 목록에서 회원을 눌렀을 때의 확인 다이얼로그 → 차단 해제 흐름 */
export const useUnblockMember = () => {
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const { mutate } = useUnblockMemberMutation();

  const confirmUnblock = (targetMemberId: number) => {
    openAlert({
      state: 'default',
      title: UNBLOCK_CONFIRM_TITLE,
      infoText: UNBLOCK_CONFIRM_INFO_TEXT,
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: () => closeAlert() },
        {
          type: 'solid',
          variant: 'primary',
          label: '해제하기',
          onClick: () => {
            closeAlert();
            mutate({ targetMemberId });
          },
        },
      ],
    });
  };

  return confirmUnblock;
};
