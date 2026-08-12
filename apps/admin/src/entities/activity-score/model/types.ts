export type ScoreViewMode = 'individual' | 'group';
export type ScoreGroupKind = 'study' | 'project';
/** 회원 점수 조회 화면 상단 필터 (개인 / 스터디 / 프로젝트) */
export type ScoreListFilter = 'individual' | ScoreGroupKind;
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
  /** 해당 기록 시점까지의 상점/벌점 누적 점수 */
  balance?: number;
};

/** 대상 선택 목록에 필요한 최소 회원 정보 */
export type ScoreTargetMember = {
  id: number;
  name: string;
  profileImageUrl?: string;
  generation: number;
  partName: string;
  /** 참여 트랙 수 — 2 이상이면 `+n` 배지를 노출한다 */
  trackCount: number;
};

/** 대상 선택 화면에서 회원을 묶는 단위 (파트명 / 팀명) */
export type ScoreTargetGroup = {
  id: string;
  title: string;
  members: ScoreTargetMember[];
};
