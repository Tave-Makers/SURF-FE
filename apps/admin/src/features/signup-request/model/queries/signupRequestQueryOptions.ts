import type { QueryClient } from '@tanstack/react-query';
import { infiniteQueryOptions } from '@tanstack/react-query';
import { getSignupRequestListClient } from '../../api/getSignupRequestListClient';
import { SignupRequestListData, SignupRequestListParams } from '../../api/types';
import { SIGNUP_REQUEST_PAGE_SIZE, SIGNUP_REQUEST_STALE_TIME } from '../constants';
import { toSignupRequestMemberList } from '../mapper';
import { signupRequestQueryKeys } from './signupRequestQueryKeys';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import {
  getNextPageNumber,
  createInfiniteDataSelector,
  InfiniteSelectResult,
  PageWithContent,
} from '@/shared/lib/tanstack-query/infiniteQueryUtils';

interface SignupRequestQueryOptionsParams {
  keyword?: string;
  fetcher?: (params: SignupRequestListParams) => Promise<SignupRequestListData>;
  queryClient?: QueryClient;
}

/**
 * 가입 신청 목록 무한스크롤 Query 옵션
 *
 * TanStack Query의 infiniteQuery 설정을 정의합니다.
 * queryFn에서 DTO → Domain Model 매핑을 수행하여 캐시에 저장합니다.
 *
 * @param params.keyword - 검색어
 * @returns infiniteQueryOptions 객체
 */
export function signupRequestQueryOptions({
  keyword = '',
  fetcher = getSignupRequestListClient,
  queryClient,
}: SignupRequestQueryOptionsParams) {
  const normalizedKeyword = keyword.trim();

  return infiniteQueryOptions<
    PageWithContent<number>,
    Error,
    InfiniteSelectResult<number>,
    ReturnType<typeof signupRequestQueryKeys.list>,
    number
  >({
    queryKey: signupRequestQueryKeys.list(normalizedKeyword),

    queryFn: async ({ pageParam = 0 }) => {
      //요청 파라미터 구성
      const params: SignupRequestListParams = {
        keyword: normalizedKeyword,
        pageNum: pageParam,
        pageSize: SIGNUP_REQUEST_PAGE_SIZE,
      };

      const response = await fetcher(params);

      const { content, ...pageMeta } = response;

      //도메인 타입으로 변환
      const members = toSignupRequestMemberList(content);

      //멤버 기본 정보 시드
      members.forEach((member) => {
        queryClient?.setQueryData(memberQueryKeys.base(member.id), member);
      });

      // 리스트 캐시에는 멤버 ID만 저장
      return {
        ...pageMeta,
        content: members.map((member) => member.id),
      };
    },

    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    select: createInfiniteDataSelector<number>(),
    throwOnError: true,
    staleTime: SIGNUP_REQUEST_STALE_TIME,
  });
}
