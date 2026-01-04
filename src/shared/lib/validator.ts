export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    try {
      // 프로토콜이 없는 경우 https://를 붙여 재검증
      new URL(`https://${url.trim()}`);
      return true;
    } catch {
      return false;
    }
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

export const onlyDigits = (raw: string) => raw.replace(/\D/g, '').slice(0, 11);

export const formatPhoneNumber = (digits: string) => {
  const d = onlyDigits(digits);

  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};
