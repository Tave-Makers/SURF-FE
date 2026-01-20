import { infiniteQueryOptions } from '@tanstack/react-query';
import { signupRequestQueryKeys, SignupRequestFilters } from './signupRequestQueryKeys';
import { getSignupRequestList } from '../../api/signupRequestApi';
import { getNextPageNumber, transformInfiniteData } from '../utils';
import { SIGNUP_REQUEST_PAGE_SIZE, SIGNUP_REQUEST_STALE_TIME } from '../constants';

/**
 * 가입 신청 목록 무한스크롤 Query 옵션
 *
 * TanStack Query의 infiniteQuery 설정을 정의합니다.
 *
 * @param filters - 필터 조건 (keyword, pageSize)
 * @returns infiniteQueryOptions 객체
 *
 * @example
 * // 기본 사용
 * const options = signupRequestQueryOptions({});
 * useInfiniteQuery(options);
 *
 * // 검색어 필터링
 * const options = signupRequestQueryOptions({ keyword: '홍길동' });
 * useInfiniteQuery(options);
 */
export function signupRequestQueryOptions(filters: SignupRequestFilters) {
  return infiniteQueryOptions({
    queryKey: signupRequestQueryKeys.list(filters),

    queryFn: ({ pageParam = 0 }) =>
      getSignupRequestList({
        keyword: filters.keyword,
        pageNumber: pageParam,
        pageSize: filters.pageSize || SIGNUP_REQUEST_PAGE_SIZE,
      }).then((res) => res.data),

    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    select: transformInfiniteData,
    staleTime: SIGNUP_REQUEST_STALE_TIME,
  });
}
