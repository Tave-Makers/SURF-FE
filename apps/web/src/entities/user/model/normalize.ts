export function normalizeTextNullable(v: unknown): string | null {
  if (v == null) return null; // null | undefined
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t : null; // '' | '   ' => null
}

export function normalizeTextString(v: unknown): string {
  // null/undefined/공백/비정상 타입 => ''
  if (typeof v !== 'string') return '';
  return v.trim(); // 공백만 있으면 ''로
}
