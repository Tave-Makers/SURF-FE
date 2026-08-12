import type {
  ActivityRecordDto,
  ActivityRecordPageDto,
  ActivityTypeDto,
  ActivityTypeGroupDto,
  MemberScoreRankingItemDto,
  ScoreRankingPageDto,
  TeamMemberScoresDto,
  TeamScoreRankingItemDto,
} from '../api/types';
import type {
  ActivityScoreMember,
  ActivityScoreTeam,
  ScoreCategory,
  ScoreGroupKind,
  ScoreHistory,
  ScoreHistoryKind,
  ScoreType,
} from './types';

const teamTypeMap: Record<string, ScoreGroupKind> = {
  STUDY: 'study',
  PROJECT: 'project',
};

const partCodeMap: Record<string, string> = {
  BACKEND: 'BE',
  WEB_FRONTEND: 'FE',
  APP_FRONTEND: 'FE',
  FRONTEND: 'FE',
  DESIGN: 'DE',
  DATA_ANALYSIS: 'DA',
  DEEP_LEARNING: 'DL',
  백엔드: 'BE',
  프론트엔드: 'FE',
  프론트: 'FE',
  디자인: 'DE',
  데이터분석: 'DA',
  딥러닝: 'DL',
};

const toScore = (value: number | null | undefined) => value ?? 0;

const normalizePartName = (part: string | null | undefined) => part?.trim() || '-';

const normalizeText = (value: string | null | undefined, fallback = '') => value?.trim() || fallback;

const normalizePartCode = (part: string | null | undefined) => {
  const normalizedPart = normalizePartName(part);
  if (!normalizedPart) return '-';

  const compactPart = normalizedPart.replace(/\s/g, '').toUpperCase();
  const mappedCode = partCodeMap[compactPart] ?? partCodeMap[normalizedPart.replace(/\s/g, '')];
  if (mappedCode) return mappedCode;

  if (/^[A-Z]{2,}$/.test(normalizedPart)) return normalizedPart.slice(0, 2);

  return normalizedPart.slice(0, 2).toUpperCase();
};

const normalizeTeamKind = (teamType: string | null | undefined): ScoreGroupKind => {
  if (teamType === 'PROJECT') return 'project';
  if (teamType === 'STUDY') return 'study';

  return 'study';
};

export const mapMemberScoreRankingItemDtoToMember = (
  dto: MemberScoreRankingItemDto,
): ActivityScoreMember => ({
  id: dto.memberId,
  name: dto.name ?? '',
  profileImageUrl: dto.profileImageUrl ?? '',
  partCode: normalizePartCode(dto.part),
  partName: normalizePartName(dto.part),
  generation: toScore(dto.generation),
  groupName: '',
  positiveScore: toScore(dto.rewardTotal),
  negativeScore: toScore(dto.penaltyTotal),
  totalScore: toScore(dto.totalScore),
  tracksCount: 1,
});

export const mapMemberScoreRankingPageDtoToMembers = (
  dto: ScoreRankingPageDto<MemberScoreRankingItemDto>,
): ActivityScoreMember[] => (dto.content ?? []).map(mapMemberScoreRankingItemDtoToMember);

export const mapTeamScoreRankingItemDtoToTeam = (
  dto: TeamScoreRankingItemDto,
  index: number,
): ActivityScoreTeam => ({
  id: dto.teamId,
  name: dto.teamName ?? '',
  kind: teamTypeMap[dto.teamType ?? ''] ?? normalizeTeamKind(dto.teamType),
  positiveScore: toScore(dto.rewardTotal),
  negativeScore: toScore(dto.penaltyTotal),
  totalScore: toScore(dto.totalScore),
  defaultOpen: index < 2,
});

export const mapTeamScoreRankingPageDtoToTeams = (
  dto: ScoreRankingPageDto<TeamScoreRankingItemDto>,
): ActivityScoreTeam[] => (dto.content ?? []).map(mapTeamScoreRankingItemDtoToTeam);

export const mapTeamMemberScoresDtoToMembers = (dto: TeamMemberScoresDto): ActivityScoreMember[] =>
  (dto.members ?? []).map(mapMemberScoreRankingItemDtoToMember);

const normalizeScoreType = (scoreType: string | null | undefined): ScoreType =>
  scoreType === 'PENALTY' ? 'PENALTY' : 'REWARD';

const getScoreHistoryKind = (scoreType: string | null | undefined): ScoreHistoryKind =>
  normalizeScoreType(scoreType) === 'PENALTY' ? 'negative' : 'positive';

const normalizeDelta = (delta: number | null | undefined, scoreType: string | null | undefined) => {
  const value = toScore(delta);
  if (normalizeScoreType(scoreType) === 'PENALTY') return -Math.abs(value);

  return Math.abs(value);
};

const formatScoreDate = (date: string | null | undefined) => {
  if (!date) return '';

  const [year, month, day] = date.split('-');
  if (!year || !month || !day) return date;

  return `${year.slice(-2)}.${month}.${day}`;
};

export const getScoreCriterionRouteId = (category: string, activityName: string) =>
  `${category}:${activityName}`;

const mapActivityTypeDtoToCriterion = (
  dto: ActivityTypeDto,
  categoryName: string,
): ScoreCategory['criteria'][number] => {
  const activityName = normalizeText(dto.typeName, normalizeText(dto.displayName, 'UNKNOWN'));
  const point = normalizeDelta(dto.delta, dto.scoreType);

  return {
    id: getScoreCriterionRouteId(categoryName, activityName),
    categoryId: categoryName,
    category: normalizeText(dto.category, categoryName),
    activityName,
    scoreType: normalizeScoreType(dto.scoreType),
    appliedTarget: normalizeText(dto.appliedTarget),
    label: `${normalizeText(dto.displayName, activityName)} (${point})`,
    point,
  };
};

export const mapActivityTypeGroupsDtoToCategories = (
  groups: ActivityTypeGroupDto[],
): ScoreCategory[] =>
  groups.map((group, index) => {
    const categoryName = normalizeText(group.category?.categoryName, `category-${index}`);
    const criteria = (group.activityTypeList ?? []).map((activityType) =>
      mapActivityTypeDtoToCriterion(activityType, categoryName),
    );

    return {
      id: categoryName,
      title: normalizeText(group.category?.categoryDisplayName, categoryName),
      criteria,
      defaultOpen: index === 0,
    };
  });

const mapActivityRecordDtoToHistory = (dto: ActivityRecordDto): ScoreHistory => {
  const kind = getScoreHistoryKind(dto.scoreType);

  return {
    id: dto.activityRecordId,
    kind,
    date: formatScoreDate(dto.activityDate),
    label: normalizeText(dto.activityName, normalizeText(dto.activityType, '-')),
    point: normalizeDelta(dto.appliedScore, dto.scoreType),
  };
};

/**
 * 활동기록 목록을 최신순으로 유지하면서, 각 기록 시점의 누적 점수(balance)를 함께 계산한다.
 * 서버가 누적 점수를 내려주지 않으므로 조회된 페이지 범위 안에서 오래된 기록부터 합산한다.
 */
export const mapActivityRecordPageDtoToHistories = (
  dto: ActivityRecordPageDto,
): ScoreHistory[] => {
  const histories = (dto.content ?? []).map(mapActivityRecordDtoToHistory);

  let cumulative = 0;

  return histories
    .slice()
    .reverse()
    .map((history) => {
      cumulative += history.point;

      return { ...history, balance: cumulative };
    })
    .reverse();
};
