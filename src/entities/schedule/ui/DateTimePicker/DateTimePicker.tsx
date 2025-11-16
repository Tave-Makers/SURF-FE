'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';
import { isToday } from 'date-fns';

type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AM_PM_OPTIONS = ['오전', '오후'];

// 연간 모든 날짜 생성 (월/일 조합)
const generateAllDates = () => {
  const dates: Array<{ month: number; day: number }> = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push({ month, day });
    }
  }
  return dates;
};

const ALL_DATES = generateAllDates();

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

  // 날짜 Wheel 인덱스 계산
  const getDateWheelIndex = useCallback((month: number, day: number) => {
    return ALL_DATES.findIndex((d) => d.month === month && d.day === day);
  }, []);

  // Wheel 인덱스 계산
  const [dateWheelIdx, setDateWheelIdx] = useState(() =>
    getDateWheelIndex(selectedMonth, selectedDay),
  );
  const [amPmIdx, setAmPmIdx] = useState(selectedAmPmIdx);
  const [hour12Idx, setHour12Idx] = useState(selectedHour12 === 12 ? 0 : selectedHour12);
  const [minuteIdx, setMinuteIdx] = useState(selectedMinute);

  // value prop이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    setCurrentDate(value);
    setDateWheelIdx(getDateWheelIndex(value.getMonth() + 1, value.getDate()));
    setAmPmIdx(value.getHours() < 12 ? 0 : 1);
    setHour12Idx(value.getHours() % 12 === 0 ? 0 : value.getHours() % 12);
    setMinuteIdx(value.getMinutes());
  }, [value, getDateWheelIndex]);

  // Wheel 선택 변경 시, newDate를 만들고 onChange 호출
  useEffect(() => {
    const selectedDate = ALL_DATES[dateWheelIdx];
    const month = selectedDate.month;
    const day = selectedDate.day;

    const hour24 =
      amPmIdx === 0 ? (hour12Idx === 0 ? 0 : hour12Idx) : hour12Idx === 0 ? 12 : hour12Idx + 12;

    const newDate = new Date(selectedYear, month - 1, day, hour24, MINUTES[minuteIdx]);

    // 무한 루프 방지: value와 다를 때만 onChange 호출
    if (newDate.getTime() !== value.getTime()) {
      onChange(newDate);
    }
  }, [dateWheelIdx, amPmIdx, hour12Idx, minuteIdx, onChange, value, selectedYear]);

  // 포매팅 함수들 (setValue에 전달)
  const formatDate = useCallback(
    (_relative: number, absolute: number): string => {
      const dateItem = ALL_DATES[absolute % ALL_DATES.length];
      const dateToCheck = new Date(selectedYear, dateItem.month - 1, dateItem.day);

      // '오늘' 처리
      if (isToday(dateToCheck)) {
        return '오늘';
      }

      // 요일 배열
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = dayOfWeek[dateToCheck.getDay()];

      return `${dateItem.month}월 ${dateItem.day}일 ${dayName}`;
    },
    [selectedYear],
  );

  const formatHour12 = useCallback((_relative: number, absolute: number): string => {
    const hour = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)][absolute % 12];
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

      {/* 날짜 Wheel (하나로 표시: "10월 1일 수") */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={dateWheelIdx}
          length={ALL_DATES.length}
          width={140}
          loop={false}
          setValue={formatDate}
          onChange={(idx) => setDateWheelIdx(idx)}
          disableHighlight
        />
      </div>

      {/* 오전/오후 Wheel */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={amPmIdx}
          length={AM_PM_OPTIONS.length}
          width={50}
          loop={false}
          setValue={(_relative, absolute) => AM_PM_OPTIONS[absolute % AM_PM_OPTIONS.length]}
          onChange={(idx) => setAmPmIdx(idx)}
          disableHighlight
        />
      </div>

      {/* 시간 Wheel */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={hour12Idx}
          length={12}
          width={35}
          loop={true}
          setValue={formatHour12}
          onChange={(idx) => setHour12Idx(idx)}
          disableHighlight
        />
      </div>

      {/* 분 Wheel */}
      <div style={{ zIndex: 2 }} className="flex h-full w-full">
        <Wheel
          value={minuteIdx}
          length={MINUTES.length}
          width={35}
          loop={true}
          setValue={formatMinute}
          onChange={(idx) => setMinuteIdx(idx)}
          disableHighlight
        />
      </div>
    </div>
  );
}
