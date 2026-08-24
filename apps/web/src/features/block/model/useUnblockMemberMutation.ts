'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { unblockMember } from '../api/unblockMember.client';
import { resolveErrorMessage } from '../lib/resolveErrorMessage';
import {
  UNBLOCK_ERROR_MESSAGE,
  UNBLOCK_ERROR_MESSAGE_BY_STATUS,
  UNBLOCK_SUCCESS_MESSAGE,
} from './constants';

/** 회원 차단 해제 뮤테이션 — DELETE /v1/user/blocks/{userId} */
export const useUnblockMemberMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: unblockMember,
    onSuccess: () => {
      // 해제된 회원의 글/댓글이 다시 보여야 하므로 전체를 무효화한다. 차단 목록도 함께 갱신된다.
      void queryClient.invalidateQueries();
      showToast(UNBLOCK_SUCCESS_MESSAGE);
    },
    onError: (error) => {
      console.error('회원 차단 해제 실패:', error);
      showToast(resolveErrorMessage(error, UNBLOCK_ERROR_MESSAGE_BY_STATUS, UNBLOCK_ERROR_MESSAGE));
    },
  });
};
