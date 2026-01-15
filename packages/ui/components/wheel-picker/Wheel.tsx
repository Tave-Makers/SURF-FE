'use client';

import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import React, { useRef, useMemo, useState } from 'react';

export const Wheel = ({
  value,
  onChange,
  length,
  loop = false,
  perspective = 'center',
  setValue,
  width,
  disableHighlight = false,
}: {
  value: number;
  onChange: (val: number) => void;
  length: number;
  loop?: boolean;
  perspective?: 'left' | 'right' | 'center';
  setValue?: (relative: number, absolute: number) => string;
  width: number;
  disableHighlight?: boolean;
}) => {
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

  function slideValues() {
    const activeIndex = value;
    const values: { style: React.CSSProperties; value: string }[] = [];

    for (let i = 0; i < length; i++) {
      const distance = i - activeIndex;
      const rotate = Math.abs(distance) > wheelSize / 2 ? 180 : distance * (360 / wheelSize) * -1;
      const isActive = i === activeIndex;

      const style = {
        transform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        WebkitTransform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        color: isActive ? '#222' : '#c4c4c4',
      };

      const valueLabel = setValue ? setValue(i, i) : String(i);

      values.push({ style, value: valueLabel });
    }
    return values;
  }

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
          {slideValues().map(({ style, value }, idx) => (
            <div className="wheel__slide" style={{ ...style, zIndex: 2 }} key={idx}>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="wheel__shadow-bottom" style={{ transform: `translateZ(${radius}px)` }} />
    </div>
  );
};
