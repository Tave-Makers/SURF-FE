'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { blockMember } from '../api/blockMember.client';
import { resolveBlockExitPath } from '../lib/resolveBlockExitPath';
import { resolveErrorMessage } from '../lib/resolveErrorMessage';
import {
  BLOCK_ERROR_MESSAGE,
  BLOCK_ERROR_MESSAGE_BY_STATUS,
  BLOCK_SUCCESS_MESSAGE,
} from './constants';

/** 회원 차단 뮤테이션 — POST /v1/user/blocks */
export const useBlockMemberMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: blockMember,
    onSuccess: () => {
      // 차단된 회원의 글/댓글은 게시글·댓글·검색 등 앱 전반에 걸쳐 있다.
      // invalidate는 캐시를 stale로만 표시해 재조회 전까지 이전 데이터를 그대로 내주므로,
      // 차단한 회원의 본문이 잠깐 보였다가 사라진다. 아예 제거해서 그 노출을 막는다.
      queryClient.removeQueries();

      // 토스트는 전역 store라 이동 후 진입점 화면에서 그대로 노출됩니다.
      showToast(BLOCK_SUCCESS_MESSAGE);

      // 차단한 회원의 게시글 상세는 404가 되므로 back()으로 돌려보내지 않는다.
      // replace라 프로필이 히스토리에서 빠져 뒤로가기가 차단한 회원 화면으로 되돌지 않는다.
      router.replace(resolveBlockExitPath(searchParams.get('boardId')));

      // 프로필 차단 여부는 서버에서 판정하므로, 캐시된 RSC 응답이 남지 않도록 갱신한다
      router.refresh();
    },
    onError: (error) => {
      console.error('회원 차단 실패:', error);
      showToast(resolveErrorMessage(error, BLOCK_ERROR_MESSAGE_BY_STATUS, BLOCK_ERROR_MESSAGE));
    },
  });
};
