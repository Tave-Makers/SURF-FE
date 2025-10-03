// =====================
// 카드용 타입 (Summary)
// =====================
import { ActivityType } from './meta';

export type SingleActivitySummary = {
  activityType: ActivityType;
  count: number;
};

export type GroupActivitySummary = {
  totalCount: number;
  list: SingleActivitySummary[];
};

export type RewardSummary = {
  taveActivities: SingleActivitySummary[];
  blogs: GroupActivitySummary;
};

export type PenaltySummary = {
  late: GroupActivitySummary;
  absence: GroupActivitySummary;
};

export type ActivitySummaryRecords = {
  rewards: RewardSummary;
  penalties: PenaltySummary;
};

export type ActivitySummaryResponse = {
  code: number;
  message: string;
  data: {
    score: number;
    records: ActivitySummaryRecords;
  };
};

// =====================
// 리스트용 타입 (History)
// =====================
export type ScoreMode = 'REWARD' | 'PENALTY';

export type ActivityHistoryRaw = {
  memberId: number;
  categoryName: string;
  activityName: string | null;
  scoreType: ScoreMode;
  activityDate: string; // ex: "25.09.19"
  prefixSum: number; // 누적 점수
  appliedScore: number; // 변동 점수 (+5 / -3)
};

export type ActivityHistory = {
  memberId: number;
  date: string;
  category: string; // 대주제
  activity?: string; // 소주제(옵션)
  delta: number;
  total: number;
};

export type ActivityHistoryResponse = {
  code: number;
  message: string;
  data: {
    content: ActivityHistoryRaw[];
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    isLast: boolean;
  };
};
