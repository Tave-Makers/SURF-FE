import type { CommonResponse, PageMeta } from '@/shared/api/types';

export type TeamScoreApiType = 'STUDY' | 'PROJECT';
export type ActivityScoreApiScoreType = 'REWARD' | 'PENALTY';

export type ScoreRankingPageDto<TContent> = PageMeta & {
  content?: TContent[] | null;
};

export interface MemberScoreRankingItemDto {
  memberId: number;
  profileImageUrl: string | null;
  name: string | null;
  generation: number | null;
  part: string | null;
  rewardTotal: number | null;
  penaltyTotal: number | null;
  totalScore: number | null;
}

export type MemberScoreRankingResponse =
  CommonResponse<ScoreRankingPageDto<MemberScoreRankingItemDto> | null>;

export interface TeamScoreRankingItemDto {
  teamId: number;
  teamName: string | null;
  teamType: string | null;
  rewardTotal: number | null;
  penaltyTotal: number | null;
  totalScore: number | null;
}

export type TeamScoreRankingResponse =
  CommonResponse<ScoreRankingPageDto<TeamScoreRankingItemDto> | null>;

export interface TeamMemberScoresDto {
  teamId: number;
  teamName: string | null;
  members?: MemberScoreRankingItemDto[] | null;
}

export type TeamMemberScoresResponse = CommonResponse<TeamMemberScoresDto | null>;

export interface ActivityCategoryDto {
  categoryName: string | null;
  categoryDisplayName: string | null;
}

export interface ActivityTypeDto {
  typeName: string | null;
  displayName: string | null;
  delta: number | null;
  scoreType: string | null;
  appliedTarget: string | null;
  category: string | null;
}

export interface ActivityTypeGroupDto {
  category: ActivityCategoryDto | null;
  activityTypeList?: ActivityTypeDto[] | null;
}

export type ActivityTypesResponse = CommonResponse<ActivityTypeGroupDto[] | null>;

export interface ActivityRecordDto {
  activityRecordId: number;
  activityType: string | null;
  activityName: string | null;
  scoreType: string | null;
  activityDate: string | null;
  appliedScore: number | null;
}

export type ActivityRecordPageDto = ScoreRankingPageDto<ActivityRecordDto>;
export type MemberActivityRecordsResponse = CommonResponse<ActivityRecordPageDto | null>;

export interface CreateActivityRecordRequest {
  memberIdList: number[];
  category: string;
  activityName: string;
  activityDate: string;
}
