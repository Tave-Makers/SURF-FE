'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';
import { isToday, addDays, differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale'; // 요일 한글 처리를 위해

type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

const MINUTES = [0, 30];
const AM_PM_OPTIONS = ['오전', '오후'];

// 기준일 설정 (예: 1900년 1월 1일, 혹은 올해 1월 1일)
// 이 날짜가 인덱스 0이 됩니다. 충분히 과거로 잡아두면 과거 날짜도 선택 가능합니다.
// 여기서는 편의상 "올해 1월 1일"을 기준으로 잡겠습니다.
const BASE_DATE = new Date(new Date().getFullYear(), 0, 1);

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // --- 1. 날짜(Date) Wheel 인덱스 계산 ---
  // value가 BASE_DATE로부터 며칠 떨어져 있는지 계산합니다.
  const getInitialDateIndex = useCallback((targetDate: Date) => {
    return differenceInCalendarDays(targetDate, BASE_DATE);
  }, []);

  // --- 2. 시간/분 인덱스 계산 ---
  const getInitialHourIndex = (date: Date) => {
    const hour = date.getHours();
    // 12시간제 (1~12) 인덱스 (0~11)
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return hour12 === 12 ? 11 : hour12 - 1;
  };

  const getInitialAmPmIndex = (date: Date) => (date.getHours() < 12 ? 0 : 1);
  const getInitialMinuteIndex = (date: Date) => (date.getMinutes() >= 30 ? 1 : 0);

  // --- 상태 관리 ---
  const [dateWheelIdx, setDateWheelIdx] = useState(() => getInitialDateIndex(value));
  const [amPmIdx, setAmPmIdx] = useState(() => getInitialAmPmIndex(value));
  const [hour12Idx, setHour12Idx] = useState(() => getInitialHourIndex(value));
  const [minuteIdx, setMinuteIdx] = useState(() => getInitialMinuteIndex(value));

  // --- 외부 value 변경 시 내부 상태 동기화 ---
  useEffect(() => {
    setDateWheelIdx(getInitialDateIndex(value));
    setAmPmIdx(getInitialAmPmIndex(value));
    setHour12Idx(getInitialHourIndex(value));
    setMinuteIdx(getInitialMinuteIndex(value));
  }, [value, getInitialDateIndex]);

  // --- Wheel 변경 시 부모에게 알림 (onChange) ---
  useEffect(() => {
    // 1. 현재 선택된 날짜 계산 (기준일 + 인덱스일)
    const selectedDate = addDays(BASE_DATE, dateWheelIdx);

    // 2. 시간 계산
    // hour12Idx(0~11) -> 1~12시
    const hour12 = hour12Idx + 1;
    let hour24 = 0;

    if (amPmIdx === 0) {
      // 오전
      hour24 = hour12 === 12 ? 0 : hour12;
    } else {
      // 오후
      hour24 = hour12 === 12 ? 12 : hour12 + 12;
    }

    // 3. 분 계산
    const minute = MINUTES[minuteIdx];

    // 4. 최종 날짜 생성
    const newDate = new Date(selectedDate);
    newDate.setHours(hour24);
    newDate.setMinutes(minute);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    // 값이 다를 때만 onChange 호출
    if (newDate.getTime() !== value.getTime()) {
      onChange(newDate);
    }
  }, [dateWheelIdx, amPmIdx, hour12Idx, minuteIdx, onChange, value]);

  // --- 포매팅 함수들 (Wheel에 텍스트로 보여질 부분) ---

  // [중요] 인덱스를 받아서 날짜 텍스트로 변환
  const formatDateLabel = useCallback((_relative: number, absolute: number): string => {
    // absolute 인덱스는 BASE_DATE로부터의 일수 차이입니다.
    const targetDate = addDays(BASE_DATE, absolute);

    if (isToday(targetDate)) {
      return '오늘';
    }

    // date-fns format을 사용하면 연도가 넘어가도 알아서 처리됨 (12월 31일 -> 1월 1일)
    // "M월 d일 EEE" 형식 (예: 1월 1일 수)
    return format(targetDate, 'M월 d일 EEE', { locale: ko });
  }, []);

  const formatHourLabel = useCallback((_: number, absolute: number) => {
    return `${(absolute % 12) + 1}`;
  }, []);

  const formatMinuteLabel = useCallback((_: number, absolute: number) => {
    return MINUTES[absolute % 2].toString().padStart(2, '0');
  }, []);

  return (
    <div className="relative flex h-44 w-full items-center justify-center gap-2">
      {/* 선택된 값 Highlight */}
      <div className="absolute top-1/2 left-0 z-10 h-[25px] w-full -translate-y-1/2 rounded-md bg-gray-300" />

      {/* 날짜 Wheel */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={dateWheelIdx}
          length={365 * 3} // [설정] 휠의 전체 길이 (예: 3년치).
          width={140}
          loop={false}
          setValue={formatDateLabel}
          onChange={setDateWheelIdx}
          disableHighlight
        />
      </div>

      {/* 오전/오후 Wheel */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={amPmIdx}
          length={2}
          width={50}
          loop={false}
          setValue={(_, abs) => AM_PM_OPTIONS[abs % 2]}
          onChange={setAmPmIdx}
          disableHighlight
        />
      </div>

      {/* 시간 Wheel */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={hour12Idx}
          length={12}
          width={35}
          loop={true}
          setValue={formatHourLabel}
          onChange={setHour12Idx}
          disableHighlight
        />
      </div>

      {/* 분 Wheel */}
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={minuteIdx}
          length={2}
          width={35}
          loop={true}
          setValue={formatMinuteLabel}
          onChange={setMinuteIdx}
          disableHighlight
        />
      </div>
    </div>
  );
}
