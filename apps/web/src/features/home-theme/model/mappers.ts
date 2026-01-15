import { TrackPart } from '@/entities/user/model/types';

export type ThemeCharacterKey =
  | 'feCharacter'
  | 'beCharacter'
  | 'dsCharacter'
  | 'daCharacter'
  | 'dlCharacter';

const PART_TO_CHARACTER_KEY: Record<TrackPart, ThemeCharacterKey> = {
  BACKEND: 'beCharacter',
  WEB_FRONTEND: 'feCharacter',
  APP_FRONTEND: 'feCharacter',
  DESIGN: 'dsCharacter',
  DATA_ANALYSIS: 'daCharacter',
  DEEP_LEARNING: 'dlCharacter',
};

export function getCharacterKeyByPart(part: string): ThemeCharacterKey {
  const characterKey = PART_TO_CHARACTER_KEY[part as TrackPart];
  if (!characterKey) {
    console.error(`Unknown part: ${part}, falling back to feCharacter`);
    return 'feCharacter';
  }
  return characterKey;
}

export const PART_LABEL: Record<string, string> = {
  BACKEND: '백엔드',
  WEB_FRONTEND: '웹 프론트엔드',
  APP_FRONTEND: '앱 프론트엔드',
  DESIGN: '디자인',
  DATA_ANALYSIS: '데이터 분석',
  DEEP_LEARNING: '딥러닝',
};
