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

export const onlyDigitsYearMonth = (raw: string) => raw.replace(/\D/g, '').slice(0, 6); // YYYYMM (최대 6자리)

export const formatYearMonth = (raw: string) => {
  const digits = onlyDigitsYearMonth(raw);

  // YYYY
  if (digits.length <= 4) return digits;

  // YYYY-M
  if (digits.length === 5) {
    const month1 = digits[4];
    // 0,1만 허용
    if (!/[01]/.test(month1)) return digits.slice(0, 4);
    return `${digits.slice(0, 4)}-${month1}`;
  }

  // YYYY-MM
  if (digits.length === 6) {
    const month = digits.slice(4, 6);
    const m = Number(month);

    if (m < 1 || m > 12) {
      // 잘못된 월이면 마지막 입력 무시
      return `${digits.slice(0, 4)}-${digits[4]}`;
    }

    return `${digits.slice(0, 4)}-${month}`;
  }

  return digits;
};

export const isYearMonth = (value: string) => {
  if (!/^\d{4}-\d{2}$/.test(value)) return false;
  const m = Number(value.slice(5, 7));
  return m >= 1 && m <= 12;
};
