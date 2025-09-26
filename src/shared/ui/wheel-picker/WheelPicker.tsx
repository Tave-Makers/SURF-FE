'use client';

import { useState, useEffect } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';

const parts = ['데이터 분석', '디자인', '딥러닝', '백엔드', '앱 프론트엔드', '웹 프론트엔드'];
const periods = [...Array(20).keys()].map((i) => `${i + 1}기`);

const dataMap = { parts, periods } as const;

type WheelPickerProps = {
  onChange?: (values: { period: string; part: string }) => void;
  initPeriodIdx?: number;
  initPartIdx?: number;
};

export const WheelPicker = ({ onChange, initPeriodIdx = 0, initPartIdx = 0 }: WheelPickerProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedPart, setSelectedPart] = useState('');

  function format<T extends keyof typeof dataMap>(type: T) {
    return (_relative: number, absolute: number): string => {
      const arr = dataMap[type];
      if (arr.length === 0) return '';
      const safeIndex = ((absolute % arr.length) + arr.length) % arr.length;
      return arr[safeIndex];
    };
  }

  const handlePeriodChange = (val: string) => {
    const newValues = { period: val, part: selectedPart };
    setSelectedPeriod(val);
    onChange?.(newValues);
  };

  const handlePartChange = (val: string) => {
    const newValues = { period: selectedPeriod, part: val };
    setSelectedPart(val);
    onChange?.(newValues);
  };

  useEffect(() => {
    if (periods.length > 0 && parts.length > 0) {
      const initialPeriod = periods[initPeriodIdx] ?? '';
      const initialPart = parts[initPartIdx] ?? '';
      setSelectedPeriod(initialPeriod);
      setSelectedPart(initialPart);
      onChange?.({ period: initialPeriod, part: initialPart });
    }
  }, [initPeriodIdx, initPartIdx, onChange]);

  return (
    <div
      style={{
        width: '335px',
        height: '176px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
      }}
    >
      <div style={{ width: 155, height: 160 }}>
        <Wheel
          initIdx={initPeriodIdx}
          length={periods.length}
          width="150px"
          loop={false}
          setValue={format('periods')}
          onChange={handlePeriodChange}
        />
      </div>

      <div style={{ width: 155, height: 160 }}>
        <Wheel
          initIdx={initPartIdx}
          length={parts.length}
          width="150px"
          loop={false}
          perspective="left"
          setValue={format('parts')}
          onChange={handlePartChange}
        />
      </div>
    </div>
  );
};
