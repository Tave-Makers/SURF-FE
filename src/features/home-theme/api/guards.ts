import { ThemeItem } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function assertThemeItem(theme: unknown): asserts theme is ThemeItem {
  if (!isRecord(theme)) {
    throw new Error('Theme must be an object');
  }

  const required = [
    'feCharacter',
    'beCharacter',
    'dsCharacter',
    'daCharacter',
    'dlCharacter',
    'background',
    'isBgDark',
  ] as const;

  for (const key of required) {
    if (!(key in theme)) {
      throw new Error(`ThemeItem missing key: ${key}`);
    }
  }

  if (typeof theme.isBgDark !== 'boolean') {
    throw new Error('isBgDark must be boolean');
  }
}
