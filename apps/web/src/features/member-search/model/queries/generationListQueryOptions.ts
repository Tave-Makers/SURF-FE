import { queryOptions } from '@tanstack/react-query';

import { toGenerationList } from '../mapper';

import { getGenerationList } from '../../api/getGenerationList';
import { memberSearchQueryKeys } from '@/features/member-search/api/queryKeys';

/**
 * 멤버 기수 목록 조회 Query 옵션
 *
 * queryFn에서 DTO -> 도메인 모델 매핑을 수행해 캐시에 저장합니다.
 */
export function generationListQueryOptions() {
  return queryOptions({
    queryKey: memberSearchQueryKeys.generations(),
    queryFn: async () => {
      const dto = await getGenerationList();
      return toGenerationList(dto);
    },
  });
}
