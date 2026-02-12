'use client';

import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import React, { useRef, useMemo, useState } from 'react';

type Props = {
  value: number;
  onChange: (val: number) => void;
  length: number;
  loop?: boolean;
  perspective?: 'left' | 'right' | 'center';
  setValue?: (relative: number, absolute: number) => string;
  width: number;
  disableHighlight?: boolean;
  windowSize?: number; // value 기준으로 앞뒤 몇 개만 렌더할지. 예: 12면 총 25개
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// loop에서 최소 거리(예: 0과 length-1은 거리 1로 취급)
function circularDistance(i: number, a: number, n: number) {
  const d = i - a;
  const alt = d > 0 ? d - n : d + n;
  return Math.abs(d) <= Math.abs(alt) ? d : alt;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export const Wheel = ({
  value,
  onChange,
  length,
  loop = false,
  perspective = 'center',
  setValue,
  width,
  disableHighlight = false,
  windowSize = 12,
}: Props) => {
  const wheelSize = 20;
  const slideDegree = 360 / wheelSize;
  const slidesPerView = loop ? 9 : 1;

  const size = useRef(0);
  const [radius, setRadius] = useState(0);

  const options = useMemo<KeenSliderOptions>(
    () => ({
      slides: {
        number: length,
        origin: loop ? 'center' : 'auto',
        perView: slidesPerView,
      },
      vertical: true,
      initial: value,
      loop,
      dragSpeed: (val) => {
        const height = size.current;
        return (
          val * (height / ((height / 2) * Math.tan(slideDegree * (Math.PI / 180))) / slidesPerView)
        );
      },
      created: (s) => {
        size.current = s.size;
        setRadius(s.size / 2);
      },
      updated: (s) => {
        size.current = s.size;
        setRadius(s.size / 2);
      },
      detailsChanged: (s) => {
        const activeIndex = s.track.details.rel;
        onChange(activeIndex);
      },
      rubberband: !loop,
      mode: 'free-snap',
    }),
    [length, loop, value, slideDegree, slidesPerView, onChange],
  );

  const [sliderRef] = useKeenSlider<HTMLDivElement>(options);

  const windowedSlides = useMemo(() => {
    if (length <= 0) return [];

    // 렌더할 index 리스트 만들기
    let indices: number[] = [];

    if (loop) {
      const start = value - windowSize;
      const end = value + windowSize;
      for (let x = start; x <= end; x++) indices.push(mod(x, length));
      // 중복 제거 (length가 작으면 window가 겹칠 수 있음)
      indices = Array.from(new Set(indices));
    } else {
      const start = clamp(value - windowSize, 0, length - 1);
      const end = clamp(value + windowSize, 0, length - 1);
      for (let i = start; i <= end; i++) indices.push(i);
    }

    return indices.map((i) => {
      const dist = loop ? circularDistance(i, value, length) : i - value;

      // 멀리 있는 건 뒷면 처리 (원래 로직 유지)
      const rotate = Math.abs(dist) > wheelSize / 2 ? 180 : dist * (360 / wheelSize) * -1;
      const isActive = i === value;

      const style: React.CSSProperties = {
        transform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        WebkitTransform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        color: isActive ? '#222' : '#c4c4c4',
      };

      const label = setValue ? setValue(i, i) : String(i);

      return { key: i, style, label };
    });
  }, [length, loop, value, windowSize, wheelSize, radius, setValue]);

  return (
    <div className={'wheel keen-slider wheel--perspective-' + perspective} ref={sliderRef}>
      <div className="wheel__shadow-top" style={{ transform: `translateZ(${radius}px)` }} />
      <div className="wheel__inner" style={{ position: 'relative' }}>
        {!disableHighlight && (
          <div
            className="wheel__highlight"
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
        )}

        <div className="wheel__slides" style={{ width: width + 'px' }}>
          {windowedSlides.map(({ key, style, label }) => (
            <div className="wheel__slide" style={{ ...style, zIndex: 2 }} key={key}>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="wheel__shadow-bottom" style={{ transform: `translateZ(${radius}px)` }} />
    </div>
  );
};
