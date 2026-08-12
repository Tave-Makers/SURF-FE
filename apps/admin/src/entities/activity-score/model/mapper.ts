import type {
  ActivityRecordDto,
  ActivityRecordPageDto,
  ActivityTypeDto,
  ActivityTypeGroupDto,
  MemberScoreRankingItemDto,
  ScoreRankingPageDto,
  TeamMemberScoresDto,
} from '../api/types';
import type {
  ActivityScoreMember,
  ScoreCategory,
  ScoreCriterion,
  ScoreHistory,
  ScoreHistoryKind,
  ScoreType,
} from './types';

const partCodeMap: Record<string, string> = {
  BACKEND: 'BE',
  WEB_FRONTEND: 'FE',
  APP_FRONTEND: 'FE',
  FRONTEND: 'FE',
  DESIGN: 'DE',
  DATA_ANALYSIS: 'DA',
  DEEP_LEARNING: 'DL',
  // 서버는 `part`를 Part.getDisplayName()(한글)으로 내려준다.
  백엔드: 'BE',
  웹프론트엔드: 'FE',
  앱프론트엔드: 'FE',
  프론트엔드: 'FE',
  프론트: 'FE',
  디자인: 'DE',
  데이터분석: 'DA',
  딥러닝: 'DL',
};

const toScore = (value: number | null | undefined) => value ?? 0;

const normalizePartName = (part: string | null | undefined) => part?.trim() || '-';

const normalizeText = (value: string | null | undefined, fallback = '') =>
  value?.trim() || fallback;

const normalizePartCode = (part: string | null | undefined) => {
  const normalizedPart = normalizePartName(part);
  if (!normalizedPart) return '-';

  const compactPart = normalizedPart.replace(/\s/g, '').toUpperCase();
  const mappedCode = partCodeMap[compactPart] ?? partCodeMap[normalizedPart.replace(/\s/g, '')];
  if (mappedCode) return mappedCode;

  if (/^[A-Z]{2,}$/.test(normalizedPart)) return normalizedPart.slice(0, 2);

  return normalizedPart.slice(0, 2).toUpperCase();
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

/**
 * 활동 종류의 라우팅 식별자.
 * ActivityType enum 값은 전역에서 유일하므로 카테고리를 함께 담을 필요가 없다.
 * (카테고리는 매칭된 항목에서 꺼내 쓴다)
 */
export const getScoreCriterionRouteId = (activityName: string) => activityName;

/** 서버 enum 값 형태(대문자 스네이크)인지 검사한다. 표시용 라벨이 섞여 들어오는 것을 막는다. */
const ENUM_VALUE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

/**
 * 점수 부여 API는 `category`/`activityName`을 enum 값으로 요구한다.
 * - `category`: 그룹의 `categoryName` (enum). `activityTypeList[].category`는 표시명이므로 쓰지 않는다.
 * - `activityName`: `typeName` (enum). `displayName`은 표시명이다.
 * enum 형태가 아니면 부여 요청이 거부되므로 선택 대상에서 제외한다.
 */
const mapActivityTypeDtoToCriterion = (
  dto: ActivityTypeDto,
  categoryName: string,
): ScoreCriterion | null => {
  const activityName = normalizeText(dto.typeName);

  if (!ENUM_VALUE_PATTERN.test(activityName) || !ENUM_VALUE_PATTERN.test(categoryName)) return null;

  const point = normalizeDelta(dto.delta, dto.scoreType);

  return {
    id: getScoreCriterionRouteId(activityName),
    categoryId: categoryName,
    category: categoryName,
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
    const categoryName = normalizeText(group.category?.categoryName);
    const criteria = (group.activityTypeList ?? [])
      .map((activityType) => mapActivityTypeDtoToCriterion(activityType, categoryName))
      .filter((criterion): criterion is ScoreCriterion => criterion !== null);

    return {
      id: categoryName,
      title: normalizeText(group.category?.categoryDisplayName, categoryName),
      criteria,
      defaultOpen: index === 0,
    };
  });

export const mapActivityRecordDtoToHistory = (dto: ActivityRecordDto): ScoreHistory => {
  const kind = getScoreHistoryKind(dto.scoreType);

  return {
    id: dto.activityRecordId,
    kind,
    date: formatScoreDate(dto.activityDate),
    label: normalizeText(dto.activityName, normalizeText(dto.activityType, '-')),
    point: normalizeDelta(dto.appliedScore, dto.scoreType),
    // 벌점 누적합은 서버에서 음수로 내려오지만, 목록의 벌점 컬럼과 동일하게 절댓값으로 표기한다.
    balance: dto.prefixSum == null ? undefined : Math.abs(dto.prefixSum),
  };
};

export const mapActivityRecordPageDtoToHistories = (dto: ActivityRecordPageDto): ScoreHistory[] =>
  (dto.content ?? []).map(mapActivityRecordDtoToHistory);
