import { ApiTrack } from '@/entities/member/api/types';
import { CommonResponse } from '@/shared/api/types';

export type GroupApiType = 'STUDY' | 'PROJECT';

// 그룹 생성

export interface CreateGroupRequest {
  generation: number;
  type: GroupApiType;
  description: string;
  leaderMemberId: number;
  memberIds: number[];
}

export interface CreateGroupResDto {
  teamId: number;
  generation: number;
  name: string;
  description: string;
  leaderId: number;
  leaderName: string;
  memberCount: number;
}

export type CreateGroupResponse = CommonResponse<CreateGroupResDto>;

// 그룹 목록 조회

interface GroupListResDto {
  teamId: number;
  generation: number;
  type: GroupApiType;
  name: string;
}

export interface GroupGenerationResDto {
  generation: number;
  teams: GroupListResDto[];
}

export type GroupGenerationListResponse = CommonResponse<GroupGenerationResDto[]>;

// 그룹 상세 조회

export interface MemberCardDto {
  memberId: number;
  name: string;
  profileImageUrl?: string;
  tracks: ApiTrack[];
}

export interface GroupDetailResDto {
  teamId: number;
  generation: number;
  type: GroupApiType;
  name: string;
  description: string;
  leader: MemberCardDto;
  members: MemberCardDto[];
}

export type GroupDetailResponse = CommonResponse<GroupDetailResDto>;
