import { CommonResponse } from '@/shared/api/types';

// =====================
// 카드용 타입 (Summary)
// =====================
import { ActivityType } from './meta';

/**
 * 단일 활동 요약
 * @property activityType - 활동 유형 (meta.ts의 ActivityType 참조)
 * @property count - 해당 활동의 횟수
 */
export type SingleActivitySummary = {
  activityType: ActivityType;
  count: number;
};

/**
 * 그룹 활동 요약 (동일 카테고리 활동들의 집계)
 * @property totalCount - 총 활동 횟수
 * @property list - 개별 활동 요약 목록
 */
export type GroupActivitySummary = {
  totalCount: number;
  list: SingleActivitySummary[];
};

/**
 * 보상(점수 획득) 활동 요약
 * @property taveActivities - Tave 관련 활동 목록
 * @property blogs - 블로그 관련 활동 그룹
 */
export type RewardSummary = {
  taveActivities: SingleActivitySummary[];
  blogs: GroupActivitySummary;
};

/**
 * 페널티(점수 차감) 활동 요약
 * @property late - 지각 관련 활동 그룹
 * @property absence - 결석 관련 활동 그룹
 */
export type PenaltySummary = {
  late: GroupActivitySummary;
  absence: GroupActivitySummary;
};

/**
 * 전체 활동 요약 레코드
 * @property rewards - 보상 활동 요약
 * @property penalties - 페널티 활동 요약
 */
export type ActivitySummaryRecords = {
  rewards: RewardSummary;
  penalties: PenaltySummary;
};

/**
 * 활동 요약 API 응답
 * @property score - 총 활동 점수
 * @property records - 활동 요약 레코드
 */
export type ActivitySummaryResponse = CommonResponse<{
  score: number;
  records: ActivitySummaryRecords;
}>;

// =====================
// 리스트용 타입 (History)
// =====================
/**
 * 점수 모드 (보상 또는 페널티)
 */
export type ScoreMode = 'REWARD' | 'PENALTY';

/**
 * 활동 이력 Raw 데이터 (백엔드 API 응답 형태)
 * @property memberId - 회원 ID
 * @property categoryName - 활동 카테고리명
 * @property activityName - 활동 세부명 (선택적)
 * @property scoreType - 점수 타입 (REWARD 또는 PENALTY)
 * @property activityDate - 활동 날짜 (예: "25.09.19")
 * @property prefixSum - 누적 점수
 * @property appliedScore - 변동 점수 (+5 / -3)
 */
export type ActivityHistoryRaw = {
  memberId: number;
  categoryName: string;
  activityName: string | null;
  scoreType: ScoreMode;
  activityDate: string;
  prefixSum: number;
  appliedScore: number;
};

/**
 * 활동 이력 도메인 모델 (UI에서 사용)
 * @property memberId - 회원 ID
 * @property date - 활동 날짜
 * @property category - 대주제 (카테고리)
 * @property activity - 소주제 (선택적)
 * @property delta - 점수 변동량
 * @property total - 누적 총점
 */
export type ActivityHistory = {
  memberId: number;
  date: string;
  category: string;
  activity?: string;
  delta: number;
  total: number;
};

/**
 * 활동 이력 목록 API 응답 (페이지네이션 포함)
 * @property content - 활동 이력 Raw 데이터 배열
 * @property pageNumber - 현재 페이지 번호
 * @property pageSize - 페이지 크기
 * @property numberOfElements - 현재 페이지의 요소 수
 * @property isLast - 마지막 페이지 여부
 */
export type ActivityHistoryResponse = CommonResponse<{
  content: ActivityHistoryRaw[];
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  isLast: boolean;
}>;
