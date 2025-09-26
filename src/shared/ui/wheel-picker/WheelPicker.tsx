'use client';

import { useState } from 'react';
import { Wheel } from '@/shared/ui/wheel-picker/Wheel';

const parts = ['데이터 분석', '디자인', '딥러닝', '백엔드', '앱 프론트엔드', '웹 프론트엔드'];
const periods = [...Array(20).keys()].map((i) => `${i + 1}기`);

const dataMap = { parts, periods } as const;

type WheelPickerProps = {
  onChange?: (values: { period: string; part: string }) => void;
};

export const WheelPicker = ({ onChange }: WheelPickerProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedPart, setSelectedPart] = useState('');

  function format<T extends keyof typeof dataMap>(type: T) {
    return (_relative: number, absolute: number): string => {
      const arr = dataMap[type];
      const safeIndex = ((absolute % arr.length) + arr.length) % arr.length;
      return arr[safeIndex];
    };
  }

  const handlePeriodChange = (val: string) => {
    setSelectedPeriod(val);
    onChange?.({ period: val, part: selectedPart });
  };

  const handlePartChange = (val: string) => {
    setSelectedPart(val);
    onChange?.({ period: selectedPeriod, part: val });
  };

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
          initIdx={1}
          length={periods.length}
          width={150}
          loop={false}
          setValue={format('periods')}
          onChange={handlePeriodChange}
        />
      </div>

      <div style={{ width: 155, height: 160 }}>
        <Wheel
          initIdx={1}
          length={parts.length}
          width={150}
          loop={false}
          perspective="left"
          setValue={format('parts')}
          onChange={handlePartChange}
        />
      </div>
    </div>
  );
};
