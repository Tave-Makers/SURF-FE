import { CommonResponse } from '@/shared/api/types';

export interface GenerationResDTO {
  generation?: number; //기수 번호
  name?: string; //기수 명
}

export interface AdminTotalMemberListResDTO {
  generations?: GenerationResDTO[]; //기수 리스트
}

export type MemberGenerationInfoResponse = CommonResponse<AdminTotalMemberListResDTO>;
