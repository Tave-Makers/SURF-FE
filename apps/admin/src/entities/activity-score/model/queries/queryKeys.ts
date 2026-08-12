export const activityScoreQueryKeys = {
  all: ['activity-score'] as const,

  activityTypes: () => [...activityScoreQueryKeys.all, 'activity-types'] as const,

  rankings: () => [...activityScoreQueryKeys.all, 'rankings'] as const,
  memberRanking: (pageSize: number) =>
    [...activityScoreQueryKeys.rankings(), 'members', pageSize] as const,

  teamMembers: () => [...activityScoreQueryKeys.all, 'team-members'] as const,
  teamMemberScores: (teamId: number) => [...activityScoreQueryKeys.teamMembers(), teamId] as const,

  activityRecords: () => [...activityScoreQueryKeys.all, 'activity-records'] as const,
  memberActivityRecords: (params: {
    memberId: number;
    scoreType: 'REWARD' | 'PENALTY';
    pageSize: number;
  }) =>
    [
      ...activityScoreQueryKeys.activityRecords(),
      'members',
      params.memberId,
      params.scoreType,
      params.pageSize,
    ] as const,
};
