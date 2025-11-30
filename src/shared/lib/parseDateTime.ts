/**
 * ISO 날짜 문자열(예: 2025-11-16T06:15:10Z)을
 * UI 표시용 { date: '25.11.16', time: '06:15' } 형식으로 변환한다.
 */
export const parseDateTime = (isoString: string) => {
  if (!isoString || typeof isoString !== 'string') {
    throw new Error('Invalid ISO string');
  }

  const dateObj = new Date(isoString);

  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${isoString}`);
  }

  // 로컬 기준 파싱
  const year = String(dateObj.getFullYear()).slice(2);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return {
    date: `${year}.${month}.${day}`, // YY.MM.DD
    time: `${hours}:${minutes}`, // HH:mm
  };
};
