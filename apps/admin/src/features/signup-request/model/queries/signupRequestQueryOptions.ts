import { infiniteQueryOptions } from '@tanstack/react-query';
import { SignupRequestMember } from '@/entities/signup-request/model/types';
import {
  getNextPageNumber,
  createInfiniteDataSelector,
  InfiniteSelectResult,
  PageWithContent,
} from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import { signupRequestQueryKeys, SignupRequestFilters } from './signupRequestQueryKeys';

import { toSignupRequestMember } from '../mapper';
import { SIGNUP_REQUEST_PAGE_SIZE, SIGNUP_REQUEST_STALE_TIME } from '../constants';
import { SignupRequestListParams, SignupRequestListResponse } from '../../api/types';
import { getSignupRequestListClient } from '../../api/getSignupRequestListClient';

interface SignupRequestQueryOptionsParams {
  filters: SignupRequestFilters;
  fetcher?: (params: SignupRequestListParams) => Promise<SignupRequestListResponse>;
}

/**
 * 가입 신청 목록 무한스크롤 Query 옵션
 *
 * TanStack Query의 infiniteQuery 설정을 정의합니다.
 * queryFn에서 DTO → Domain Model 매핑을 수행하여 캐시에 저장합니다.
 *
 * @param params.filters - 필터 조건 (keyword, pageSize)
 * @param params.isServer - 서버 컴포넌트에서 호출 여부 (옵셔널)
 * @returns infiniteQueryOptions 객체
 */
export function signupRequestQueryOptions({
  filters,
  fetcher = getSignupRequestListClient,
}: SignupRequestQueryOptionsParams) {
  const normalizedFilters: SignupRequestFilters = { ...filters };
  if (!normalizedFilters.keyword) {
    delete normalizedFilters.keyword;
  }

  return infiniteQueryOptions<
    PageWithContent<SignupRequestMember>,
    Error,
    InfiniteSelectResult<SignupRequestMember>,
    ReturnType<typeof signupRequestQueryKeys.list>,
    number
  >({
    queryKey: signupRequestQueryKeys.list(normalizedFilters),

    queryFn: async ({ pageParam = 0 }) => {
      const params: SignupRequestListParams = {
        pageNum: pageParam,
        pageSize: normalizedFilters.pageSize || SIGNUP_REQUEST_PAGE_SIZE,
      };

      // keyword가 있을 때만 파라미터에 추가
      if (normalizedFilters.keyword) {
        params.keyword = normalizedFilters.keyword;
      }

      const response = await fetcher(params);
      const { content, ...pageMeta } = response.data;

      // queryFn에서 매핑: 캐시에 Domain Model로 저장
      return {
        ...pageMeta,
        content: content.map(toSignupRequestMember),
      };
    },

    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    select: createInfiniteDataSelector<SignupRequestMember>(),
    staleTime: SIGNUP_REQUEST_STALE_TIME,
  });
}
