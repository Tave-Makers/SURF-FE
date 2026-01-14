'use client';

import { useState, useEffect } from 'react';
import { Wheel } from './Wheel';

const parts = ['데이터 분석', '디자인', '딥러닝', '백엔드', '앱 프론트엔드', '웹 프론트엔드'];
const periods = [...Array(20).keys()].map((i) => `${i + 1}기`);

const dataMap = { parts, periods } as const;

type WheelPickerProps = {
  onChange?: (values: { period: string; part: string }) => void;
  initPeriodIdx?: number;
  initPartIdx?: number;
};

export const WheelPicker = ({ onChange, initPeriodIdx = 0, initPartIdx = 0 }: WheelPickerProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[initPeriodIdx] ?? '');
  const [selectedPart, setSelectedPart] = useState(parts[initPartIdx] ?? '');

  const [selectedPeriodIdx, setSelectedPeriodIdx] = useState(initPeriodIdx);
  const [selectedPartIdx, setSelectedPartIdx] = useState(initPartIdx);

  function format<T extends keyof typeof dataMap>(type: T) {
    return (_relative: number, absolute: number): string => {
      const arr = dataMap[type];
      if (arr.length === 0) return '';
      const safeIndex = ((absolute % arr.length) + arr.length) % arr.length;
      return arr[safeIndex] || '';
    };
  }

  const handlePeriodChange = (val: string) => {
    const idx = periods.indexOf(val);
    if (idx === -1) return;
    setSelectedPeriodIdx(idx);
    setSelectedPeriod(val);
    onChange?.({ period: val, part: selectedPart });
  };

  const handlePartChange = (val: string) => {
    const idx = parts.indexOf(val);
    if (idx === -1) return;
    setSelectedPartIdx(idx);
    setSelectedPart(val);
    onChange?.({ period: selectedPeriod, part: val });
  };

  useEffect(() => {
    onChange?.({ period: selectedPeriod, part: selectedPart });
  }, [onChange, selectedPeriod, selectedPart]);

  return (
    <div
      style={{
        width: '100%',
        height: '176px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
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

      {/* Period Wheel */}
      <div style={{ width: 155, height: 160, zIndex: 2 }}>
        <Wheel
          value={selectedPeriodIdx}
          length={periods.length}
          width={150}
          loop={false}
          setValue={format('periods')}
          onChange={(idx) => handlePeriodChange(periods[idx] || '')}
          disableHighlight
        />
      </div>

      {/* Part Wheel */}
      <div style={{ width: 155, height: 160, zIndex: 2 }}>
        <Wheel
          value={selectedPartIdx}
          length={parts.length}
          width={150}
          loop={false}
          perspective="left"
          setValue={format('parts')}
          onChange={(idx) => handlePartChange(parts[idx] || '')}
          disableHighlight
        />
      </div>
    </div>
  );
};
