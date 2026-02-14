import { CommonResponse } from '@/shared/api/types';

export interface GenerationResDTO {
  generation?: number; //기수 번호
  name?: string; //기수 명
}

export interface AdminTotalMemberListResDTO {
  totalMemberCount?: number; //전체 회원 수
  generations?: GenerationResDTO[]; //기수 리스트
}

export type MemberGenerationInfoResponse = CommonResponse<AdminTotalMemberListResDTO>;
