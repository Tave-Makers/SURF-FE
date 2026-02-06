import type { components } from '@/shared/api/__generated__/openapi';
import { CommonResponse } from '@/shared/api/types';

type Schemas = components['schemas'];

export type MemberInformationResDTO = Schemas['MemberInformationResDTO'];

/**
 * 멤버 정보 조회 응답
 */
export type MemberInfoResponse = CommonResponse<MemberInformationResDTO>;
