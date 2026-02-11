export function toDate(isoString: string): Date {
  return new Date(isoString);
}

export function toKST(date: Date) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60 * 1000);
}

export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export function formatDateTime(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${d} ${hh}:${mm}`;
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;

  return formatDate(date);
}

// Date 객체를 받아 MM.DD로 변환
export function formatMonthDay(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}.${d}`;
}

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
