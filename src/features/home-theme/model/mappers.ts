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
  return PART_TO_CHARACTER_KEY[part as TrackPart] ?? 'feCharacter';
}
