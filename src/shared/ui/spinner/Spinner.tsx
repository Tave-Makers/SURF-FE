import React from 'react';
import { Wheel } from '@/shared/ui/spinner/Wheel';
import './styles.css';

const parts = ['데이터 분석', '디자인', '딥러닝', '백엔드', '앱 프론트엔드', '웹 프론트엔드'];
const periods = [
  '1기',
  '2기',
  '3기',
  '4기',
  '5기',
  '6기',
  '7기',
  '8기',
  '9기',
  '10기',
  '11기',
  '12기',
  '13기',
  '14기',
  '15기',
  '16기',
  '17기',
  '18기',
  '19기',
  '20기',
];

export const Spinner = () => {
  function formateParts(_relative: number, absolute: number) {
    return parts[absolute];
  }

  function formatePeriods(_relative: number, absolute: number) {
    return periods[absolute];
  }

  return (
    <div
      style={{
        width: '335px',
        height: '176px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
      }}
    >
      <div style={{ width: 155, height: 160 }}>
        <Wheel initIdx={1} length={parts.length} width={150} loop={false} setValue={formateParts} />
      </div>

      <div style={{ width: 155, height: 160 }}>
        <Wheel
          initIdx={1}
          length={periods.length}
          width={150}
          loop={false}
          perspective="left"
          setValue={formatePeriods}
        />
      </div>
    </div>
  );
};
