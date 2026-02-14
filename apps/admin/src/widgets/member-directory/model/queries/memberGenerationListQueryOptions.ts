import { queryOptions } from '@tanstack/react-query';

import { toMemberGenerationList } from '../mapper';
import { MemberDirectoryInfo } from '../types';
import { memberGenerationKeys } from './queryKeys';
import { getMemberGenerationInfoClient } from '../../api/getMemberGenerationInfoClient';
import { AdminTotalMemberListResDTO } from '../../api/types';

interface MemberGenerationListQueryOptionsParams {
  fetcher?: () => Promise<AdminTotalMemberListResDTO>;
}

/**
 * 멤버 기수 목록 조회 Query 옵션
 *
 * queryFn에서 DTO -> 도메인 모델 매핑을 수행해 캐시에 저장합니다.
 */
export function memberGenerationListQueryOptions({
  fetcher = getMemberGenerationInfoClient,
}: MemberGenerationListQueryOptionsParams = {}) {
  return queryOptions<MemberDirectoryInfo, Error, MemberDirectoryInfo>({
    queryKey: memberGenerationKeys.lists(),
    queryFn: async () => {
      const dto = await fetcher();
      return toMemberGenerationList(dto);
    },
  });
}
