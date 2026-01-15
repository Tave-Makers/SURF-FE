import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themePath = path.resolve(__dirname, '../raw-data/image.json');

/**
 * Theme Types
 */
type ThemeItem = {
  feCharacter: string;
  beCharacter: string;
  dsCharacter: string;
  daCharacter: string;
  dlCharacter: string;
  background: string;
  isBgDark: boolean;
  [key: string]: unknown;
};

type ThemeConfig = {
  currentSeason: string;
  base: ThemeItem;
  seasons: Record<string, ThemeItem>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function assertThemeItem(v: unknown, label = 'theme'): asserts v is ThemeItem {
  if (!isRecord(v)) throw new Error(`${label} must be an object`);

  const required = [
    'feCharacter',
    'beCharacter',
    'dsCharacter',
    'daCharacter',
    'dlCharacter',
    'background',
    'isBgDark',
  ] as const;

  for (const k of required) {
    if (!(k in v)) throw new Error(`${label} missing key: ${k}`);
  }

  // 문자열 필드 기본 검증
  for (const k of required.slice(0, 6)) {
    const val = v[k];
    if (typeof val !== 'string' || val.trim() === '') {
      throw new Error(`${label}.${k} must be a non-empty string`);
    }
  }

  // 불리언 검증
  if (typeof v.isBgDark !== 'boolean') {
    throw new Error(`${label}.isBgDark must be boolean`);
  }

  // URL 형태 최소 검증
  for (const k of required.slice(0, 6)) {
    const s = v[k] as string;
    if (!/^https?:\/\/.+/i.test(s)) {
      throw new Error(`${label}.${k} must look like a URL (http/https)`);
    }
  }
}

function assertThemeConfig(v: unknown): asserts v is ThemeConfig {
  if (!isRecord(v)) throw new Error('ThemeConfig must be an object');

  if (typeof v.currentSeason !== 'string' || v.currentSeason.trim() === '') {
    throw new Error('ThemeConfig.currentSeason must be a non-empty string');
  }

  if (!('base' in v)) throw new Error('ThemeConfig.base is required');
  assertThemeItem(v.base, 'base');

  if (!('seasons' in v)) throw new Error('ThemeConfig.seasons is required');
  if (!isRecord(v.seasons)) throw new Error('ThemeConfig.seasons must be an object');

  for (const [seasonKey, item] of Object.entries(v.seasons)) {
    assertThemeItem(item, `seasons["${seasonKey}"]`);
  }

  // 정책: currentSeason은 seasons에 반드시 존재해야 업로드 허용
  const seasonKey = v.currentSeason.trim();
  if (!(seasonKey in v.seasons)) {
    throw new Error(
      `currentSeason "${seasonKey}" not found in seasons. Add it to seasons or change currentSeason.`,
    );
  }
}

function readJsonFile(filePath: string): unknown {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`❌ Failed to read/parse JSON: ${filePath}`);
    throw e;
  }
}

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL must be set');
  process.exit(1);
}

// 파일 로드
const themeUnknown = readJsonFile(themePath);

// 기본 검증
try {
  assertThemeConfig(themeUnknown);
} catch (e) {
  console.error('❌ Theme JSON validation failed:', e);
  process.exit(1);
}

const theme: ThemeConfig = themeUnknown;

async function main() {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/update-theme`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(theme),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Error: HTTP ${res.status} - ${errorText}`);
      process.exit(1);
    }

    const data = await res.text();
    console.log('✅ Result:', data);
  } catch (error) {
    console.error('❌ Network or fetch error:', error);
    process.exit(1);
  }
}

void main();
