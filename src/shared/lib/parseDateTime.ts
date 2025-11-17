/**
 * ISO 날짜 문자열(예: 2025-11-16T06:15:10Z)을
 * UI 표시용 { date: '25.11.16', time: '06:15' } 형식으로 변환한다.
 */
export const parseDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);

  // 날짜 파트 (YYYY-MM-DD)
  const [yearFull, month, day] = dateObj.toISOString().split('T')[0].split('-');

  const year = yearFull.slice(2);
  const date = `${year}.${month}.${day}`; // YY.MM.DD

  // 시간 (HH:mm)
  const time = dateObj.toTimeString().slice(0, 5);

  return { date, time };
};
