'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import type { BlockMemberRequest } from '../api/types';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BLOCK_ERROR_MESSAGE, BLOCK_SUCCESS_MESSAGE } from './constants';

/**
 * 회원 차단 뮤테이션
 *
 * TODO: 백엔드 차단 API 미연동 상태. 스펙 확정 후 아래만 교체하면 됩니다.
 *  1. `features/block/api/blockMember.client.ts` 추가 (예: POST /v1/user/blocks)
 *  2. 여기 mutationFn을 해당 함수 호출로 교체
 *  3. `api/types.ts`의 BlockMemberRequest를 실제 DTO에 맞게 수정
 */
export const useBlockMemberMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: (request: BlockMemberRequest) => {
      console.warn('[차단] API 미연동 상태입니다. 요청 값:', request);
      return Promise.resolve();
    },
    onSuccess: () => {
      // 차단된 회원의 글/댓글은 게시글·댓글·검색 등 앱 전반에 걸쳐 있어 전체를 무효화한다.
      void queryClient.invalidateQueries();

      // 토스트는 전역 store라 이동 후 진입점 화면에서 그대로 노출됩니다.
      showToast(BLOCK_SUCCESS_MESSAGE);

      // 프로필은 게시글/주소록 등 진입점에서 push되어 들어오므로 back이면 원래 화면으로 돌아간다.
      if (window.history.length > 1) {
        router.back();
        return;
      }
      router.push(PAGE_ROUTES.MEMBER.MEMBER_SEARCH);
    },
    onError: (error) => {
      console.error('회원 차단 실패:', error);
      showToast(BLOCK_ERROR_MESSAGE);
    },
  });
};
