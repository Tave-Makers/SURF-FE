import type { components } from '@/shared/api/__generated__/openapi';
import { CommonResponse } from '@/shared/api/types';

export type MemberInformationResDTO = components['schemas']['MemberInformationResDTO'];

/**
 * 멤버 정보 조회 응답
 */
export type MemberInfoResponse = CommonResponse<MemberInformationResDTO>;
