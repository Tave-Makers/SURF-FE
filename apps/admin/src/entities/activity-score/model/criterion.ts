import type { ScoreCategory, ScoreCriterion } from './types';

/**
 * 팀 단위로 부여해야 하는 활동인지 여부.
 * 현재 부여 화면은 회원(개인)만 선택할 수 있어 팀 대상 활동은 부여할 수 없다.
 * 팀 선택 UI가 생기면 이 구분으로 화면을 분기한다.
 */
export const isTeamScoreCriterion = (criterion: ScoreCriterion) =>
  criterion.appliedTarget === 'TEAM';

/** 개인에게 부여 가능한 활동만 남긴다. 항목이 모두 빠진 카테고리는 함께 제거한다. */
export const filterIndividualScoreCategories = (categories: ScoreCategory[]): ScoreCategory[] =>
  categories
    .map((category) => ({
      ...category,
      criteria: category.criteria.filter((criterion) => !isTeamScoreCriterion(criterion)),
    }))
    .filter((category) => category.criteria.length > 0);
