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
  /** 내가 차단한 회원인지 — 차단해도 목록에서 제외되지 않고 표기만 된다 */
  blockedByMe: boolean;
}

export interface MemberSearchPageMeta extends PageMeta {
  totalCount: number | null;
}

export interface MemberSearchResponse extends MemberSearchPageMeta {
  content: MemberSearchItemDTO[];
}

export type MemberSearchApiResponse = CommonResponse<MemberSearchResponse>;

// 기수 목록
export interface GenerationResDTO {
  generation?: number; // 기수 번호
  name?: string; // 기수 명
}

export interface GenerationListResDTO {
  generations?: GenerationResDTO[]; // 기수 리스트
}

export type GenerationListResponse = CommonResponse<GenerationListResDTO>;
