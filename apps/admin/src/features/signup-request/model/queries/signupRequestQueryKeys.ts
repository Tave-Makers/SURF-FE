/**
 * 가입 신청 관련 Query Keys
 *
 * @example
 * // 전체 목록 조회
 * queryKey: signupRequestQueryKeys.list('')
 *
 * // 검색어로 필터링
 * queryKey: signupRequestQueryKeys.list('홍길동')
 *
 * // 모든 가입신청 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: signupRequestQueryKeys.all })
 *
 * // 특정 필터의 쿼리만 무효화
 * queryClient.invalidateQueries({
 *   queryKey: signupRequestQueryKeys.list('홍길동')
 * })
 */
export const signupRequestQueryKeys = {
  all: ['signup-request'] as const,
  lists: () => [...signupRequestQueryKeys.all, 'list'] as const,
  list: (keyword: string) => [...signupRequestQueryKeys.lists(), { keyword: keyword.trim() }] as const,
};
