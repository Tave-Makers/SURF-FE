'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';
import { isToday } from 'date-fns';

type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

// 연도 생성 (현재 연도 기준 ±10년)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
};

const YEARS = generateYears();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
// const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AM_PM_OPTIONS = ['오전', '오후']; // 오전/오후 옵션

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // RHF에서 넘어온 value를 기준으로 내부 상태 초기화
  const [currentDate, setCurrentDate] = useState(value);

  // 파생 상태
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.getMonth() + 1;
  const selectedDay = currentDate.getDate();
  const selectedHour = currentDate.getHours();
  const selectedMinute = currentDate.getMinutes();

  // 오전/오후 상태 (0: 오전, 1: 오후)
  const selectedAmPmIdx = selectedHour < 12 ? 0 : 1;
  // 12시간제로 변환된 시간
  const selectedHour12 = selectedHour % 12 === 0 ? 12 : selectedHour % 12;

  // 선택된 연도/월에 맞는 일수 계산
  const getDaysInMonth = useCallback((year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  }, []);

  const maxDays = getDaysInMonth(selectedYear, selectedMonth);
  const availableDays = useMemo(() => Array.from({ length: maxDays }, (_, i) => i + 1), [maxDays]);

  // Wheel 인덱스 계산 (초기값 및 업데이트 로직)
  const getYearIndex = useCallback((year: number) => YEARS.indexOf(year), []);
  const getMonthIndex = useCallback((month: number) => month - 1, []);
  const getDayIndex = useCallback(
    (day: number, maxDays: number) => Math.min(day - 1, maxDays - 1),
    [],
  );

  const [yearIdx, setYearIdx] = useState(() => getYearIndex(selectedYear));
  const [monthIdx, setMonthIdx] = useState(() => getMonthIndex(selectedMonth));
  const [dayIdx, setDayIdx] = useState(() => getDayIndex(selectedDay, maxDays));
  const [amPmIdx, setAmPmIdx] = useState(selectedAmPmIdx);
  const [hour12Idx, setHour12Idx] = useState(selectedHour12 === 12 ? 0 : selectedHour12); // 12시면 0으로 매핑
  const [minuteIdx, setMinuteIdx] = useState(selectedMinute);

  // value prop이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    setCurrentDate(value);
    setYearIdx(getYearIndex(value.getFullYear()));
    setMonthIdx(getMonthIndex(value.getMonth() + 1));
    const maxDays = getDaysInMonth(value.getFullYear(), value.getMonth() + 1);
    setDayIdx(getDayIndex(value.getDate(), maxDays));
    setAmPmIdx(value.getHours() < 12 ? 0 : 1);
    setHour12Idx(value.getHours() % 12 === 0 ? 0 : value.getHours() % 12);
    setMinuteIdx(value.getMinutes());
  }, [value, getYearIndex, getMonthIndex, getDayIndex, getDaysInMonth]);

  // Wheel 선택 변경 시, newDate를 만들고 onChange 호출
  useEffect(() => {
    const hour24 =
      amPmIdx === 0
        ? hour12Idx === 0
          ? 0
          : hour12Idx // 오전: 12시 -> 0시, 그 외는 그대로
        : hour12Idx === 0
          ? 12
          : hour12Idx + 12; // 오후: 12시 -> 12시, 그 외는 +12

    const newDate = new Date(
      YEARS[yearIdx],
      MONTHS[monthIdx] - 1,
      availableDays[dayIdx],
      hour24,
      MINUTES[minuteIdx],
    );

    // 무한 루프 방지: value와 다를 때만 onChange 호출
    if (newDate.getTime() !== value.getTime()) {
      onChange(newDate);
    }
  }, [yearIdx, monthIdx, dayIdx, amPmIdx, hour12Idx, minuteIdx, onChange, value, availableDays]);

  // 월 변경 시 일수 조정
  useEffect(() => {
    const newMaxDays = getDaysInMonth(YEARS[yearIdx], MONTHS[monthIdx]);
    if (availableDays[dayIdx] > newMaxDays) {
      setDayIdx(newMaxDays - 1);
    }
  }, [yearIdx, monthIdx, dayIdx, availableDays, getDaysInMonth]);

  // 포매팅 함수들 (setValue에 전달)
  const formatMonth = useCallback((_relative: number, absolute: number): string => {
    const month = MONTHS[absolute % MONTHS.length];
    return `${month}월`;
  }, []);

  const formatDay = useCallback(
    (_relative: number, absolute: number): string => {
      const day = availableDays[absolute % availableDays.length];
      const dateToCheck = new Date(selectedYear, selectedMonth - 1, day);

      // '오늘' 처리
      if (isToday(dateToCheck)) {
        return '오늘'; // 이미지와 같이 '오늘' 표시
      }
      return `${day}일`;
    },
    [availableDays, selectedYear, selectedMonth],
  );

  const formatHour12 = useCallback((_relative: number, absolute: number): string => {
    const hour = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)][absolute % 12]; // 12, 1, 2, ... 11
    return `${hour}`;
  }, []);

  const formatMinute = useCallback((_relative: number, absolute: number): string => {
    const minute = MINUTES[absolute % MINUTES.length];
    return `${minute.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '176px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        gap: '8px',
      }}
    >
      {/* 선택된 값 Highlight */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '25px',
          backgroundColor: '#dfdfdf',
          borderRadius: '4px',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      />

      {/* 월 Wheel */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={monthIdx}
          length={MONTHS.length}
          width={60}
          loop={false}
          setValue={formatMonth}
          onChange={(idx) => setMonthIdx(idx)}
          disableHighlight
        />
      </div>

      {/* 일 Wheel */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={dayIdx}
          length={availableDays.length}
          width={60}
          loop={false} // 날짜는 루프 안됨
          setValue={formatDay}
          onChange={(idx) => setDayIdx(idx)}
          disableHighlight
        />
      </div>

      {/* 오전/오후 Wheel (새로 추가) */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={amPmIdx}
          length={AM_PM_OPTIONS.length}
          width={50}
          loop={false} // 오전/오후는 루프 안됨 (오전 -> 오후, 오후 -> 오전)
          setValue={(_relative, absolute) => AM_PM_OPTIONS[absolute % AM_PM_OPTIONS.length]}
          onChange={(idx) => setAmPmIdx(idx)}
          disableHighlight
        />
      </div>

      {/* 시간 Wheel (12시간제) */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full gap-2">
        <Wheel
          value={hour12Idx}
          length={12} // 12시간제 (12, 1, ..., 11)
          width={30}
          loop={true} // 시간은 루프 가능
          setValue={formatHour12}
          onChange={(idx) => setHour12Idx(idx)}
          disableHighlight
        />

        {/* 분 Wheel */}
        <Wheel
          value={minuteIdx}
          length={MINUTES.length}
          width={30}
          loop={true} // 분은 루프 가능
          setValue={formatMinute}
          onChange={(idx) => setMinuteIdx(idx)}
          disableHighlight
        />
      </div>
    </div>
  );
}
