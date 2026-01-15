/**
 * 서버에서 온 시간 문자열에 Z가 없으면 강제로 붙여서
 * 브라우저가 UTC로 인식하고 로컬 시간(KST)으로 변환하게 함
 */
export const ensureUtcDate = (dateStr: string | Date | null | undefined): Date => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;

  // 끝에 Z가 없고 타임존 오프셋(+09:00 등)이 없는 경우에만 Z를 붙임
  const dateWithZ = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;

  return new Date(dateWithZ);
};
