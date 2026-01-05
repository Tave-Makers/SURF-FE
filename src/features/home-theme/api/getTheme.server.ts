import 'server-only';
import type { ThemeConfig, ThemeItem } from './types';

const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not set');
}

export async function getTheme(): Promise<ThemeItem> {
  const url = `${SUPABASE_URL}/storage/v1/object/public/assets/config/image.json`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch theme: ${res.status} ${res.statusText}`);
  }

  const config = (await res.json()) as ThemeConfig;

  const seasonKey = (config.currentSeason ?? '').trim();
  return config.seasons?.[seasonKey] ?? config.base ?? {};
}
