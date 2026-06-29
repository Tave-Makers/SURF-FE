import type { ScoreGroupKind } from '../types';

export const activityScoreQueryKeys = {
  all: ['activity-score'] as const,

  activityTypes: () => [...activityScoreQueryKeys.all, 'activity-types'] as const,

  rankings: () => [...activityScoreQueryKeys.all, 'rankings'] as const,
  memberRanking: (pageNum: number, pageSize: number) =>
    [...activityScoreQueryKeys.rankings(), 'members', pageNum, pageSize] as const,
  teamRanking: (params: {
    kind?: ScoreGroupKind;
    generation?: number;
    pageNum: number;
    pageSize: number;
  }) =>
    [
      ...activityScoreQueryKeys.rankings(),
      'teams',
      params.kind ?? null,
      params.generation ?? null,
      params.pageNum,
      params.pageSize,
    ] as const,

  teamMembers: () => [...activityScoreQueryKeys.all, 'team-members'] as const,
  teamMemberScores: (teamId: number) => [...activityScoreQueryKeys.teamMembers(), teamId] as const,

  activityRecords: () => [...activityScoreQueryKeys.all, 'activity-records'] as const,
  memberActivityRecords: (params: {
    memberId: number;
    scoreType: 'REWARD' | 'PENALTY';
    pageNum: number;
    pageSize: number;
  }) =>
    [
      ...activityScoreQueryKeys.activityRecords(),
      'members',
      params.memberId,
      params.scoreType,
      params.pageNum,
      params.pageSize,
    ] as const,
};
