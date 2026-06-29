export type ScoreViewMode = 'individual' | 'group';
export type ScoreGroupKind = 'study' | 'project';
export type ScoreTargetKind = 'part' | 'study' | 'project';
export type ScoreHistoryKind = 'positive' | 'negative';
export type ScoreCategoryId = string;
export type ScoreType = 'REWARD' | 'PENALTY';

export type ActivityScoreMember = {
  id: number;
  name: string;
  partCode: string;
  partName: string;
  generation: number;
  groupName: string;
  profileImageUrl?: string;
  positiveScore: number;
  negativeScore: number;
  totalScore: number;
  tracksCount: number;
};

export type ActivityScoreGroup = {
  id: string;
  name: string;
  kind: ScoreGroupKind;
  memberIds: number[];
  defaultOpen?: boolean;
};

export type ActivityScoreTeam = {
  id: number;
  name: string;
  kind: ScoreGroupKind;
  positiveScore: number;
  negativeScore: number;
  totalScore: number;
  defaultOpen?: boolean;
};

export type ScoreCriterion = {
  id: string;
  categoryId: ScoreCategoryId;
  category?: string;
  activityName?: string;
  scoreType?: ScoreType;
  appliedTarget?: string;
  label: string;
  point: number;
};

export type ScoreCategory = {
  id: ScoreCategoryId;
  title: string;
  criteria: ScoreCriterion[];
  defaultOpen?: boolean;
};

export type ScoreHistory = {
  id: number;
  memberId?: number;
  kind: ScoreHistoryKind;
  date: string;
  label: string;
  point: number;
  balance?: number;
};
