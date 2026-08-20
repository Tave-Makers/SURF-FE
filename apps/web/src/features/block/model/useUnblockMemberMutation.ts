'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UnblockMemberRequest } from '../api/types';
import { UNBLOCK_ERROR_MESSAGE, UNBLOCK_SUCCESS_MESSAGE } from './constants';

/**
 * 회원 차단 해제 뮤테이션
 *
 * TODO: 백엔드 차단 API 미연동 상태. 스펙 확정 후 아래만 교체하면 됩니다.
 *  1. `features/block/api/unblockMember.client.ts` 추가 (예: DELETE /v1/user/blocks/{targetMemberId})
 *  2. 여기 mutationFn을 해당 함수 호출로 교체
 *  3. `api/types.ts`의 UnblockMemberRequest를 실제 DTO에 맞게 수정
 */
export const useUnblockMemberMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: (request: UnblockMemberRequest) => {
      console.warn('[차단 해제] API 미연동 상태입니다. 요청 값:', request);
      return Promise.resolve();
    },
    onSuccess: () => {
      // 해제된 회원의 글/댓글이 다시 보여야 하므로 전체를 무효화한다.
      void queryClient.invalidateQueries();
      showToast(UNBLOCK_SUCCESS_MESSAGE);
    },
    onError: (error) => {
      console.error('회원 차단 해제 실패:', error);
      showToast(UNBLOCK_ERROR_MESSAGE);
    },
  });
};
