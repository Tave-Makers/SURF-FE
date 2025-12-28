'use client';

import { useState, useCallback, useMemo } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';
import { isToday, addDays, differenceInCalendarDays, format, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

const MINUTES = [0, 30];
const AM_PM_OPTIONS = ['오전', '오후'];

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // index 0 => 오늘
  const BASE_DATE = useMemo(() => startOfDay(new Date()), []);

  const getIndicesFromDate = useCallback(
    (date: Date) => {
      const diff = differenceInCalendarDays(date, BASE_DATE);
      const hour = date.getHours();
      const minute = date.getMinutes();

      return {
        dateIdx: Math.max(0, diff),
        amPmIdx: hour < 12 ? 0 : 1,
        hourIdx: (hour % 12 === 0 ? 12 : hour % 12) === 12 ? 11 : (hour % 12) - 1,
        minuteIdx: minute >= 30 ? 1 : 0,
      };
    },
    [BASE_DATE],
  );

  // 초기값 설정
  const [indices, setIndices] = useState(() => getIndicesFromDate(value));

  // --- 이벤트 핸들러 ---
  const handleWheelChange = useCallback(
    (type: 'date' | 'ampm' | 'hour' | 'minute', newIndex: number) => {
      setIndices((prev) => ({
        ...prev,
        [type === 'date'
          ? 'dateIdx'
          : type === 'ampm'
            ? 'amPmIdx'
            : type === 'hour'
              ? 'hourIdx'
              : 'minuteIdx']: newIndex,
      }));

      const currentIndices = {
        ...indices,
        [type === 'date'
          ? 'dateIdx'
          : type === 'ampm'
            ? 'amPmIdx'
            : type === 'hour'
              ? 'hourIdx'
              : 'minuteIdx']: newIndex,
      };

      const { dateIdx, amPmIdx, hourIdx, minuteIdx } = currentIndices;

      const selectedDate = addDays(BASE_DATE, dateIdx);

      const hour12 = hourIdx + 1;
      let hour24 = 0;

      if (amPmIdx === 0) {
        // 오전
        hour24 = hour12 === 12 ? 0 : hour12;
      } else {
        // 오후
        hour24 = hour12 === 12 ? 12 : hour12 + 12;
      }

      const minute = MINUTES[minuteIdx];

      const newDate = new Date(selectedDate);
      newDate.setHours(hour24);
      newDate.setMinutes(minute);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      // 부모에게 전달
      onChange(newDate);
    },
    [indices, BASE_DATE, onChange],
  );

  const formatDateLabel = useCallback(
    (_: number, absolute: number) => {
      const targetDate = addDays(BASE_DATE, absolute);
      if (isToday(targetDate)) return '오늘';
      return format(targetDate, 'M월 d일 (E)', { locale: ko });
    },
    [BASE_DATE],
  );

  return (
    <div className="relative flex h-44 w-full items-center justify-center gap-2">
      {/* 선택된 값 Highlight */}
      <div className="absolute top-1/2 left-0 z-10 h-[25px] w-full -translate-y-1/2 rounded-md bg-gray-300" />

      {/* 날짜 Wheel */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={indices.dateIdx}
          length={365} // 1년치만 보여줌
          width={140}
          loop={false}
          setValue={formatDateLabel}
          onChange={(idx) => handleWheelChange('date', idx)}
          disableHighlight
        />
      </div>

      {/* 오전/오후 */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={indices.amPmIdx}
          length={2}
          width={50}
          loop={false}
          setValue={(_, abs) => AM_PM_OPTIONS[abs % 2]}
          onChange={(idx) => handleWheelChange('ampm', idx)}
          disableHighlight
        />
      </div>

      {/* 시간 */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={indices.hourIdx}
          length={12}
          width={35}
          loop={true}
          setValue={(_, abs) => `${(abs % 12) + 1}`}
          onChange={(idx) => handleWheelChange('hour', idx)}
          disableHighlight
        />
      </div>

      {/* 분 */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={indices.minuteIdx}
          length={2}
          width={35}
          loop={true}
          setValue={(_, abs) => MINUTES[abs % 2].toString().padStart(2, '0')}
          onChange={(idx) => handleWheelChange('minute', idx)}
          disableHighlight
        />
      </div>
    </div>
  );
}
