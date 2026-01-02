export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // 프로토콜 없는 경우 https://를 앞에 붙여서 재시도
    return /^https?:\/\//.test(`https://${url.trim()}`);
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
