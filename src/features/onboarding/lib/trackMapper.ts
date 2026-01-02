import { TrackPart } from '@/entities/user/model/types';

// 한글 → 백엔드 enum
export const toEnumPartMap: Record<string, TrackPart> = {
  백엔드: 'BACKEND',
  '웹 프론트엔드': 'WEB_FRONTEND',
  '앱 프론트엔드': 'APP_FRONTEND',
  디자인: 'DESIGN',
  '데이터 분석': 'DATA_ANALYSIS',
  딥러닝: 'DEEP_LEARNING',
};

// 백엔드 enum → 한글
export const toLabelPartMap: Record<TrackPart, string> = {
  BACKEND: '백엔드',
  WEB_FRONTEND: '웹 프론트엔드',
  APP_FRONTEND: '앱 프론트엔드',
  DESIGN: '디자인',
  DATA_ANALYSIS: '데이터 분석',
  DEEP_LEARNING: '딥러닝',
};

export function mapToApiTrack(period: string, part: string) {
  const generation = parseInt(period.replace('기', ''), 10);
  const mappedPart = toEnumPartMap[part];

  if (!mappedPart) {
    throw new Error(`지원하지 않는 part 값입니다: ${part}`);
  }

  return {
    generation,
    part: mappedPart,
  };
}

export function formatTrackLabel(generation: number | null, part: TrackPart | null) {
  if (!generation || !part) return '';
  return `${generation}기 ${toLabelPartMap[part]}`;
}
