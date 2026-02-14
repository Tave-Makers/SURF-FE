'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { toMemberGenerationList } from '../mapper';
import { MemberDirectoryInfo } from '../types';
import { memberGenerationKeys } from './queryKeys';
import { getMemberGenerationInfoClient } from '../../api/getMemberGenerationInfoClient';

/**
 * 전체 회원 수/기수 목록 조회 훅
 */
export function useMemberGenerationListQuery() {
  return useSuspenseQuery<MemberDirectoryInfo, Error, MemberDirectoryInfo>({
    queryKey: memberGenerationKeys.lists(),
    queryFn: async () => {
      const dto = await getMemberGenerationInfoClient();
      return toMemberGenerationList(dto); //dto 도메인 모델로 변환
    },
  });
}
