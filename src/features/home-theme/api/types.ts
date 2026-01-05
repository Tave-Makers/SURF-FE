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

export type ThemeConfig = {
  currentSeason: string;
  base: ThemeItem;
  seasons: Record<string, ThemeItem>;
};
