import { GetMemberCountParams } from '../../api/getMemberCount';

export const memberQueryKeys = {
  all: ['member'] as const,

  //멤버 수 카운트
  counts: () => [...memberQueryKeys.all, 'count'] as const,
  count: (filters: GetMemberCountParams) => [...memberQueryKeys.counts(), filters] as const,

  // 기수 요약(총원/기수 목록)
  directory: () => [...memberQueryKeys.all, 'directory'] as const,

  // 기수별 무한 리스트
  lists: () => [...memberQueryKeys.all, 'list'] as const,
  generationList: (generation: number, keyword: string) =>
    [...memberQueryKeys.lists(), { generation, keyword: keyword.trim() }] as const,

  // 단건 캐시(멤버 카드 컴포넌트에 사용)
  base: (memberId: number) => [...memberQueryKeys.all, 'base', memberId] as const,

  // 활동 기수 기준 파트별 그룹
  groupedByPart: (generation: number) =>
    [...memberQueryKeys.all, 'grouped-by-part', generation] as const,

  // 상세
  detail: (memberId: number) => [...memberQueryKeys.all, 'detail', memberId] as const,
};
