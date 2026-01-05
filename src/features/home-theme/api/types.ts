/**
 * 히어로카드 스타일에 필요한 항목
 *
 * @property background - 배경 이미지 URL
 * @property isBgDark - 배경이 어두운 테마인지 여부 (텍스트 색상 결정에 사용)
 * @property feCharacter - 프론트엔드 파트 캐릭터 이미지 URL
 * @property beCharacter - 백엔드 파트 캐릭터 이미지 URL
 * @property dsCharacter - 디자인 파트 캐릭터 이미지 URL
 * @property daCharacter - 데이터 분석 파트 캐릭터 이미지 URL
 * @property dlCharacter - 딥러닝 파트 캐릭터 이미지 URL
 */
export type ThemeItem = {
  background?: string;
  isBgDark?: boolean;

  feCharacter?: string;
  beCharacter?: string;
  dsCharacter?: string;
  daCharacter?: string;
  dlCharacter?: string;

  // 필요하면 확장
  [key: string]: unknown;
};

/**
 * Supabase에서 로드되는 테마 설정 전체 구조
 *
 * @property currentSeason - 현재 활성화된 시즌 키 (예: "2024-winter")
 * @property base - 기본 테마 (시즌 테마가 없을 때 폴백)
 * @property seasons - 시즌별 캐릭터/배경
 */
export type ThemeConfig = {
  currentSeason: string;
  base: ThemeItem;
  seasons: Record<string, ThemeItem>;
};
