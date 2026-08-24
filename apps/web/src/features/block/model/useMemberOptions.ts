'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';

import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { BLOCK_CONFIRM_INFO_TEXT, BLOCK_CONFIRM_TITLE } from './constants';
import { useBlockMemberMutation } from './useBlockMemberMutation';

type UseMemberOptionsParams = {
  /** 프로필 신고 화면으로 이동. 라우팅은 경로를 아는 호출부가 담당한다. */
  onReport: () => void;
};

/** 회원 프로필의 신고·차단 시트 → (차단은) 확인 다이얼로그 → 차단 접수까지의 흐름을 묶는다. */
export const useMemberOptions = (memberId: number, { onReport }: UseMemberOptionsParams) => {
  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const { mutate } = useBlockMemberMutation();

  const confirmBlock = () => {
    openAlert({
      state: 'default',
      title: BLOCK_CONFIRM_TITLE,
      infoText: BLOCK_CONFIRM_INFO_TEXT,
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: () => closeAlert() },
        {
          type: 'solid',
          variant: 'danger',
          label: '차단하기',
          onClick: () => {
            // 차단 후 진입점 화면으로 이동하므로 포커스 복원을 건너뛴다
            closeAlert({ restoreFocus: false });
            mutate({ memberId });
          },
        },
      ],
    });
  };

  const openMemberOptionSheet = () => {
    openBottomSheet({ type: 'memberOption', props: { onReport, onBlock: confirmBlock } });
  };

  return openMemberOptionSheet;
};
