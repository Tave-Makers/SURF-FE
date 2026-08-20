'use client';

import { useQuery } from '@tanstack/react-query';

import type { BlockedMemberResponse } from '../api/types';
import { blockQueryKeys } from './queryKeys';

/**
 * 차단한 회원 목록 조회
 *
 * TODO: 백엔드 차단 API 미연동 상태. 스펙 확정 후 queryFn을 실제 조회로 교체
 *  (예: GET /v1/user/blocks → BlockedMemberListResponse)
 */
export const useBlockedMembersQuery = () =>
  useQuery({
    queryKey: blockQueryKeys.blockedMembers(),
    queryFn: (): Promise<BlockedMemberResponse[]> => Promise.resolve([]),
  });
