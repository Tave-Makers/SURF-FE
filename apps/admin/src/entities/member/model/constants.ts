import { TrackPart } from './types';

/**
 * 파트 타입을 한글로 변환
 */
export const PART_LABELS: Record<TrackPart, string> = {
  BACKEND: '백엔드',
  WEB_FRONTEND: '웹 프론트엔드',
  APP_FRONTEND: '앱 프론트엔드',
  DESIGN: '디자인',
  DATA_ANALYSIS: '데이터 분석',
  DEEP_LEARNING: '딥러닝',
};
