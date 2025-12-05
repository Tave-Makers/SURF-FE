/**
 * 시작일/마감일 분 단위 00분과 30분으로 초기화 유틸
 */

export const getInitialDate = () => {
  const date = new Date();
  const minutes = date.getMinutes();

  // 30분 이상: 30분 / 30분 미만: 0분 설정
  const newMinutes = minutes >= 30 ? 30 : 0;

  date.setMinutes(newMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};
