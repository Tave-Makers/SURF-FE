import { format } from 'date-fns';

export const ymd = (d: unknown) => {
  let dt: Date;

  // 1. d가 이미 Date 객체인지 확인
  if (d instanceof Date) {
    dt = d;
  }
  // 2. d가 string 또는 number 타입인지 확인
  else if (typeof d === 'string' || typeof d === 'number') {
    dt = new Date(d);
  }
  // 3. 그 외의 모든 타입(null, undefined, object 등)은 거부
  else {
    return '';
  }

  // 4. 생성된 Date 객체가 유효한지 확인 (예: new Date('invalid-string'))
  if (Number.isNaN(dt.getTime())) return '';

  return format(dt, 'yyyy-MM-dd');
};
