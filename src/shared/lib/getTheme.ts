import 'dotenv/config';

type ThemeConfig = {
  currentSeason: string;
  seasons: Record<string, { feCharacter?: string; background?: string; isBgDark?: boolean }>;
  base: { feCharacter?: string; background?: string; isBgDark?: boolean };
};

const SUPABASE_URL = process.env.SUPABASE_URL;

export async function getTheme() {
  const url = `${SUPABASE_URL}/storage/v1/object/public/assets/config/image.json`;

  const res: Response = await fetch(url, { cache: 'no-store' });

  const raw = (await res.json()) as unknown;

  const config = raw as ThemeConfig;

  const season = config.currentSeason?.trim();
  return config.seasons[season] ?? config.base;
}
