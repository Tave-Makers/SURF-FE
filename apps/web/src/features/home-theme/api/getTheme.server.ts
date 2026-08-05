import 'server-only';
import { assertThemeItem } from './guards';
import type { ThemeConfig, ThemeItem } from './types';

const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not set');
}

export async function getTheme(): Promise<ThemeItem> {
  const url = `${SUPABASE_URL}/storage/v1/object/public/assets/config/image.json`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch theme: ${res.status} ${res.statusText}`);
  }

  const config = (await res.json()) as ThemeConfig;

  const seasonKey = (config.currentSeason ?? '').trim();
  const theme = config.seasons?.[seasonKey] ?? config.base;

  if (!theme) {
    throw new Error(`Theme not found for season: ${seasonKey}`);
  }
  assertThemeItem(theme);
  return theme;
}
