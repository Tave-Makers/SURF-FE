import 'server-only';

import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import type { BlockedMemberListResponse } from './types';

const PAGE_SIZE = 100;
/** 차단 목록이 비정상적으로 길 때 무한 순회를 막는 안전장치 */
const MAX_PAGES = 20;

/**
 * 내가 차단한 회원인지 서버에서 확인한다.
 *
 * 차단 목록을 순회하는 이유는 프로필 조회 응답에 차단 여부가 없기 때문이다.
 * TODO: `GET /v1/user/members/profile` 응답에 `blockedByMe`가 추가되면
 *       이 순회를 지우고 해당 필드로 대체한다.
 *
 * 조회에 실패하면 `false`를 반환한다. 차단 목록 API 장애로 모든 프로필이
 * 404가 되는 것보다, 차단한 회원이 잠시 보이는 쪽이 피해가 작다.
 */
export async function isMemberBlocked(memberId: number): Promise<boolean> {
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const res = await serverFetchWithCookies(`/v1/user/blocks?page=${page}&size=${PAGE_SIZE}`);
    if (!res.ok) return false;

    const body = (await res.json()) as BlockedMemberListResponse;
    const slice = body.data;

    if (slice.content.some((member) => member.memberId === memberId)) return true;
    if (!slice.hasNext) return false;
  }

  return false;
}
