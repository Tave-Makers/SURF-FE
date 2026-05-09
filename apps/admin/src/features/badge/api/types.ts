import { CommonResponse } from '@/shared/api/types';

export interface BadgeListParams {
  pageNum: number;
  pageSize: number;
}

export interface CreateBadgeRequest {
  name: string;
  imageUrl: string;
  description: string;
  requirement: string;
}

export interface BadgeResDto extends CreateBadgeRequest {
  badgeId: number;
}

export interface BadgeListData {
  content: BadgeResDto[];
  pageNumber: number;
  pageSize: number;
  numberOfElements?: number;
  isLast?: boolean;
  hasNext?: boolean;
  totalCount?: number;
}

export type BadgeListResponse = CommonResponse<BadgeListData>;

export interface BadgeAwardedMemberResDto {
  memberId: number;
  username: string;
  profileImageUrl?: string;
  trackList?: {
    generation: number;
    part: string;
  }[];
  awardedAt: string;
}

export interface BadgeMembersResDto {
  content: BadgeAwardedMemberResDto[];
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
}

export type UpdateBadgeRequest = Partial<CreateBadgeRequest>;

export interface RemoveBadgeMembersRequest {
  memberIds: number[];
}

export interface AssignBadgeMembersRequest {
  memberIds: number[];
}
