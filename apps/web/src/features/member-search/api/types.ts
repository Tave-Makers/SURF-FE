import { ServerUserLevel, TrackPart } from '@/entities/user/model/types';
import { CommonResponse, PageMeta } from '@/shared/api/types';

export interface MemberSearchRequestDTO {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  generation?: number;
  part?: TrackPart;
}

export interface MemberSearchItemDTO {
  memberId: number;
  username: string;
  university: string;
  selfIntroduction: string | null;
  profileImageUrl: string | null;
  role: ServerUserLevel;
  trackList: {
    generation: number;
    part: TrackPart;
  }[];
}

export interface MemberSearchPageMeta extends PageMeta {
  totalCount: number | null;
}

export interface MemberSearchResponse extends MemberSearchPageMeta {
  content: MemberSearchItemDTO[];
}

export type MemberSearchApiResponse = CommonResponse<MemberSearchResponse>;
