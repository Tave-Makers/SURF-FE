import type {
  ActivityScoreGroup,
  ActivityScoreMember,
  ScoreCategory,
  ScoreCriterion,
  ScoreGroupKind,
  ScoreHistory,
  ScoreHistoryKind,
} from './types';

const memberGroups = [
  { groupName: '디자인 스터디', partCode: 'DE', partName: '디자인' },
  { groupName: '백엔드 스터디', partCode: 'BE', partName: '백엔드' },
  { groupName: '프론트 스터디', partCode: 'FE', partName: '프론트' },
];

export const ACTIVITY_SCORE_MEMBERS: ActivityScoreMember[] = Array.from({ length: 12 }, (_, i) => {
  const group = memberGroups[i % memberGroups.length] ?? memberGroups[0];

  return {
    id: i + 1,
    name: '테이비',
    partCode: i % 3 === 0 ? 'DE' : group.partCode,
    partName: group.partName,
    generation: i === 0 ? 13 : 15,
    groupName: group.groupName,
    positiveScore: i === 0 ? 156 : 999,
    negativeScore: i === 0 ? 0 : 999,
    totalScore: i === 0 ? 156 : 999,
    tracksCount: i % 4 === 0 ? 2 : 1,
  };
});

export const ACTIVITY_SCORE_GROUPS: ActivityScoreGroup[] = [
  {
    id: 'design-study',
    name: '디자인 스터디',
    kind: 'study',
    memberIds: [1, 4, 7, 10],
    defaultOpen: true,
  },
  {
    id: 'backend-study',
    name: '백엔드 스터디',
    kind: 'study',
    memberIds: [2, 5, 8, 11],
    defaultOpen: true,
  },
  {
    id: 'frontend-study',
    name: '프론트 스터디',
    kind: 'study',
    memberIds: [3, 6, 9, 12],
    defaultOpen: false,
  },
  {
    id: 'surf-web-project',
    name: 'SURF 웹 프로젝트',
    kind: 'project',
    memberIds: [1, 2, 3, 4],
    defaultOpen: true,
  },
  {
    id: 'admin-project',
    name: '어드민 프로젝트',
    kind: 'project',
    memberIds: [5, 6, 7, 8],
    defaultOpen: false,
  },
];

export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: 'personal-positive',
    title: '개인: 상점',
    defaultOpen: true,
    criteria: [
      { id: 'earlybird', categoryId: 'personal-positive', label: '행사 얼리버드 (5)', point: 5 },
      { id: 'after-party', categoryId: 'personal-positive', label: '뒷풀이 참여 (5)', point: 5 },
      { id: 'flash-host', categoryId: 'personal-positive', label: '번개모임 주최 (10)', point: 10 },
      { id: 'flash-join', categoryId: 'personal-positive', label: '번개모임 참여 (5)', point: 5 },
      {
        id: 'agit-share',
        categoryId: 'personal-positive',
        label: '아지트 정보 공유 (3)',
        point: 3,
      },
      { id: 'seminar', categoryId: 'personal-positive', label: '기술 세미나 참여 (10)', point: 10 },
      { id: 'proposal', categoryId: 'personal-positive', label: '기획안 발표 (10)', point: 10 },
      {
        id: 'small-group-create',
        categoryId: 'personal-positive',
        label: '소모임 생성 (15)',
        point: 15,
      },
      { id: 'small-group', categoryId: 'personal-positive', label: '소모임 활동 (3)', point: 3 },
      { id: 'wil', categoryId: 'personal-positive', label: 'WIL 작성 (3)', point: 3 },
      {
        id: 'instagram',
        categoryId: 'personal-positive',
        label: '인스타 스토리 업로드 (3)',
        point: 3,
      },
      { id: 'review', categoryId: 'personal-positive', label: '활동 후기 업로드 (20)', point: 20 },
      {
        id: 'leader-role',
        categoryId: 'personal-positive',
        label: '팀장 역할 수행 (10)',
        point: 10,
      },
    ],
  },
  {
    id: 'personal-negative',
    title: '개인: 벌점',
    criteria: [
      {
        id: 'regular-session-absence',
        categoryId: 'personal-negative',
        label: '정규 세션 결석 (-30)',
        point: -30,
      },
      {
        id: 'regular-session-no-show',
        categoryId: 'personal-negative',
        label: '정규 세션 무단 결석 (-100)',
        point: -100,
      },
      {
        id: 'regular-session-late-10',
        categoryId: 'personal-negative',
        label: '정규세션 지각 (-10)',
        point: -10,
      },
      {
        id: 'regular-session-late-20',
        categoryId: 'personal-negative',
        label: '정규세션 지각 (-20)',
        point: -20,
      },
      {
        id: 'regular-session-late-30',
        categoryId: 'personal-negative',
        label: '정규세션 지각 (-30)',
        point: -30,
      },
      { id: 'study-late-5', categoryId: 'personal-negative', label: '스터디 지각 (-5)', point: -5 },
      {
        id: 'study-late-10',
        categoryId: 'personal-negative',
        label: '스터디 지각 (-10)',
        point: -10,
      },
      {
        id: 'study-late-15',
        categoryId: 'personal-negative',
        label: '스터디 지각 (-15)',
        point: -15,
      },
      {
        id: 'study-absence',
        categoryId: 'personal-negative',
        label: '스터디 결석 (-30)',
        point: -30,
      },
      {
        id: 'project-late-5',
        categoryId: 'personal-negative',
        label: '프로젝트 지각 (-5)',
        point: -5,
      },
      {
        id: 'project-late-10',
        categoryId: 'personal-negative',
        label: '프로젝트 지각 (-10)',
        point: -10,
      },
      {
        id: 'project-late-15',
        categoryId: 'personal-negative',
        label: '프로젝트 지각 (-15)',
        point: -15,
      },
      {
        id: 'project-absence',
        categoryId: 'personal-negative',
        label: '프로젝트 결석 (-30)',
        point: -30,
      },
      {
        id: 'vote-missing',
        categoryId: 'personal-negative',
        label: '투표 미참여 (-15)',
        point: -15,
      },
      {
        id: 'deposit-late',
        categoryId: 'personal-negative',
        label: '보증금 입금 지연 (-5)',
        point: -5,
      },
      {
        id: 'after-party-missing',
        categoryId: 'personal-negative',
        label: '뒷풀이 불참 (-10)',
        point: -10,
      },
    ],
  },
  {
    id: 'study',
    title: '스터디',
    criteria: [
      { id: 'study-host', categoryId: 'study', label: '스터디 리드 (10)', point: 10 },
      { id: 'study-review', categoryId: 'study', label: '스터디 회고 작성 (5)', point: 5 },
    ],
  },
  {
    id: 'project',
    title: '프로젝트',
    criteria: [
      { id: 'project-lead', categoryId: 'project', label: '프로젝트 리드 (10)', point: 10 },
      { id: 'project-demo', categoryId: 'project', label: '프로젝트 데모 발표 (10)', point: 10 },
    ],
  },
];

export const SCORE_HISTORY: ScoreHistory[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  memberId: 1,
  kind: 'positive',
  date: '26.09.06',
  label: '얼리버드',
  point: 10,
  balance: 136,
}));

export const NEGATIVE_SCORE_HISTORY: ScoreHistory[] = [
  {
    id: 101,
    memberId: 1,
    kind: 'negative',
    date: '26.09.06',
    label: '정규 세션 결석',
    point: -30,
    balance: 126,
  },
];

export const getScoreMemberById = (memberId: number) =>
  ACTIVITY_SCORE_MEMBERS.find((member) => member.id === memberId) ?? ACTIVITY_SCORE_MEMBERS[0];

export const getScoreCriterionById = (criterionId: string): ScoreCriterion | undefined =>
  SCORE_CATEGORIES.flatMap((category) => category.criteria).find(
    (criterion) => criterion.id === criterionId,
  );

export const getActivityScoreGroups = (kind: ScoreGroupKind) =>
  ACTIVITY_SCORE_GROUPS.filter((group) => group.kind === kind);

export const getScoreHistoryByKind = (kind: ScoreHistoryKind) =>
  kind === 'positive' ? SCORE_HISTORY : NEGATIVE_SCORE_HISTORY;
