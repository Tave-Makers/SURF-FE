import type { CommonResponse } from '@/shared/api/types';

export type TeamApiType = 'STUDY' | 'PROJECT';

export interface TeamTrackDto {
  generation: number | null;
  part: string | null;
}

export interface TeamListItemDto {
  teamId: number;
  generation: number | null;
  type: TeamApiType | null;
  name: string | null;
}

export interface TeamGenerationSectionDto {
  generation: number | null;
  teams?: TeamListItemDto[] | null;
}

export type TeamListResponse = CommonResponse<TeamGenerationSectionDto[] | null>;

export interface TeamMemberCardDto {
  memberId: number;
  name: string | null;
  profileImageUrl?: string | null;
  tracks?: TeamTrackDto[] | null;
}

export interface TeamDetailDto {
  teamId: number;
  generation: number | null;
  type: TeamApiType | null;
  name: string | null;
  description: string | null;
  leader?: TeamMemberCardDto | null;
  members?: TeamMemberCardDto[] | null;
}

export type TeamDetailResponse = CommonResponse<TeamDetailDto | null>;
