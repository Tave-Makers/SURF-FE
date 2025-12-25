import { ServerUserLevel } from '@/entities/user/model/types';
import { CommonResponse, PageMeta } from '@/shared/api/types';

export interface MemberSearchItemDTO {
  memberId: number;
  username: string;
  selfIntroduction: string | null;
  profileImageUrl: string | null;
  role: ServerUserLevel;
  trackList: {
    generation: number;
    part: string;
  }[];
}

export interface MemberSearchPageMeta extends PageMeta {
  totalCount: number | null;
}

export interface MemberSearchResponse extends MemberSearchPageMeta {
  content: MemberSearchItemDTO[];
}

export type MemberSearchApiResponse = CommonResponse<MemberSearchResponse>;
