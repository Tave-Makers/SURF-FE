'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { KeenSliderOptions, TrackDetails, useKeenSlider } from 'keen-slider/react';

export function Wheel({
  initIdx = 0,
  length,
  loop = false,
  perspective = 'center',
  setValue,
  onChange,
  width,
}: {
  initIdx?: number;
  length: number;
  loop?: boolean;
  perspective?: 'left' | 'right' | 'center';
  setValue?: (relative: number, absolute: number) => string;
  onChange?: (val: string) => void;
  width: number;
}) {
  const wheelSize = 20;
  const slideDegree = 360 / wheelSize;
  const slidesPerView = loop ? 9 : 1;

  const size = useRef(0);
  const [sliderState, setSliderState] = useState<TrackDetails | null>(null);
  const [radius, setRadius] = useState(0);

  const options = useMemo<KeenSliderOptions>(
    () => ({
      slides: {
        number: length,
        origin: loop ? 'center' : 'auto',
        perView: slidesPerView,
      },
      vertical: true,
      initial: initIdx,
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
        setSliderState(s.track.details);
      },
      rubberband: !loop,
      mode: 'free-snap',
    }),
    [length, loop, initIdx, slideDegree, slidesPerView],
  );

  const [sliderRef] = useKeenSlider<HTMLDivElement>(options);

  useEffect(() => {
    if (!sliderState || !onChange) return;
    const activeIndex = sliderState.rel;
    const activeValue = setValue ? setValue(activeIndex, sliderState.abs) : String(activeIndex);

    onChange(activeValue);
  }, [sliderState, setValue, onChange]);

  function slideValues() {
    if (!sliderState) return [];
    const offset = loop ? 1 / 2 - 1 / slidesPerView / 2 : 0;
    const activeIndex = sliderState.rel;
    const values: { style: React.CSSProperties; value: string }[] = [];

    for (let i = 0; i < length; i++) {
      const distance = (sliderState.slides[i].distance - offset) * slidesPerView;
      const rotate = Math.abs(distance) > wheelSize / 2 ? 180 : distance * (360 / wheelSize) * -1;
      const isActive = i === activeIndex;

      const style = {
        transform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        WebkitTransform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        color: isActive ? '#222' : '#828282',
      };

      const value = setValue ? setValue(i, sliderState.abs + Math.round(distance)) : String(i);

      values.push({ style, value });
    }
    return values;
  }

  return (
    <div className={'wheel keen-slider wheel--perspective-' + perspective} ref={sliderRef}>
      <div className="wheel__shadow-top" style={{ transform: `translateZ(${radius}px)` }} />
      <div className="wheel__inner" style={{ position: 'relative' }}>
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
}
