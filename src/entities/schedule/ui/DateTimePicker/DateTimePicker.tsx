'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';
import { isToday } from 'date-fns';

type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

// 분 단위를 30분 간격(0, 30)으로만 설정
const MINUTES = [0, 30];
const AM_PM_OPTIONS = ['오전', '오후'];

// 연간 모든 날짜 생성 (월/일 조합)
const generateAllDates = () => {
  const dates: Array<{ month: number; day: number }> = [];
  // 현재 연도를 기준으로 날짜를 생성
  const currentYear = new Date().getFullYear();
  for (let month = 1; month <= 12; month++) {
    // new Date(year, month, 0) => month의 마지막 날짜.
    const daysInMonth = new Date(currentYear, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push({ month, day });
    }
  }
  return dates;
};

const ALL_DATES = generateAllDates();

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  // RHF에서 넘어온 value를 기준 내부 상태 초기화
  const [currentDate, setCurrentDate] = useState(value);

  // 파생 상태
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.getMonth() + 1;
  const selectedDay = currentDate.getDate();
  const selectedHour = currentDate.getHours();
  const selectedMinute = currentDate.getMinutes(); // 0-59

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
  const [hour12Idx, setHour12Idx] = useState(selectedHour12 === 12 ? 11 : selectedHour12 - 1);

  // 분 인덱스 계산: 30분 이상이면 1 (30분), 미만이면 0 (00분)
  const initialMinuteIdx = selectedMinute >= 30 ? 1 : 0;
  const [minuteIdx, setMinuteIdx] = useState(initialMinuteIdx);

  // value prop이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    setCurrentDate(value);
    setDateWheelIdx(getDateWheelIndex(value.getMonth() + 1, value.getDate()));
    setAmPmIdx(value.getHours() < 12 ? 0 : 1);

    const valueHour = value.getHours();
    const valueHour12 = valueHour % 12 === 0 ? 12 : valueHour % 12; // 1~12
    setHour12Idx(valueHour12 === 12 ? 11 : valueHour12 - 1);

    // 분 업데이트 로직: 30분 간격으로 매핑 (00분 또는 30분)
    const newMinute = value.getMinutes();
    setMinuteIdx(newMinute >= 30 ? 1 : 0);
  }, [value, getDateWheelIndex]);

  // Wheel 선택 변경 시, newDate를 만들고 onChange 호출
  // 이 onChange는 ScheduleCreateForm에서 임시 상태를 업데이트하는 데 사용됩니다.
  useEffect(() => {
    const selectedDate = ALL_DATES[dateWheelIdx];
    const month = selectedDate.month;
    const day = selectedDate.day;

    // 인덱스 0~11 → 1~12
    const hour12 = (hour12Idx % 12) + 1;

    let hour24: number;
    if (amPmIdx === 0) {
      // 오전: 12시는 0시, 나머지는 그대로
      hour24 = hour12 % 12; // 12 -> 0, 1~11 -> 1~11
    } else {
      // 오후: 12시는 12시, 나머지는 +12
      hour24 = hour12 === 12 ? 12 : hour12 + 12; // 1~11 -> 13~23
    }

    // MINUTES[minuteIdx]는 0 또는 30
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
    // 인덱스 0 -> 1시, 1 -> 2시, ... 11 -> 12시
    const hour = (absolute % 12) + 1;
    return `${hour}`;
  }, []);

  const formatMinute = useCallback((_relative: number, absolute: number): string => {
    // MINUTES는 [0, 30] 이므로 absolute % 2 = 0 또는 1
    const minute = MINUTES[absolute % MINUTES.length];
    return `${minute.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="relative flex h-44 w-full items-center justify-center gap-2">
      {/* 선택된 값 Highlight */}
      <div className="absolute top-1/2 left-0 z-10 h-[25px] w-full -translate-y-1/2 rounded-md bg-gray-300" />

      {/* 날짜 Wheel (예) "10월 1일 수" */}
      <div className="z-20 flex h-full w-full">
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
      <div className="z-20 flex h-full w-full">
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
      <div className="z-20 flex h-full w-full">
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
      <div className="z-20 flex h-full w-full">
        <Wheel
          value={minuteIdx}
          length={MINUTES.length} // 이제 2 (00분, 30분)
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
