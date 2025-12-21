'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pagenation } from '../pagenation/Pagenation';
import { Control } from './Control';

interface CarouselImage {
  src: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
  className?: string;
}

const baseStyle =
  'rounded-5 w-full h-[9.375rem] relative overflow-hidden bg-white bg-gradient-to-b from-background-carousel-start to-background-carousel-end shadow-[0_2px_8px_rgba(0,0,0,0.06)]';

export const Carousel = ({ images, className = '' }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const length = images.length;

  const resetTimer = useCallback(() => {
    // 이전 타미어 존재하면 제거
    if (timerRef.current) clearTimeout(timerRef.current);

    // 2장 이상일 때만 autoplay
    if (length <= 1) return;

    // 4초 후 다음 이미지로 이동
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 4000);
  }, [length]);

  // 이미지 변경마다 타이머 새로 설정
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, resetTimer]);

  // 좌측 버튼
  const handlePrev = () => {
    // 음수 인덱스 방지하여 이동
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // 우측 버튼
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  if (length === 0) {
    return <div className={`${baseStyle} ${className}`} />;
  }

  return (
    <div className={`${baseStyle} ${className} group`}>
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.src}
            alt={img.alt}
            className="h-full w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>

      {length > 1 && (
        <>
          {/* 좌측 버튼 */}
          <Control
            direction="left"
            onClick={handlePrev}
            className="absolute top-1/2 left-[10px] -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          />

          {/* 우측 버튼 */}
          <Control
            direction="right"
            onClick={handleNext}
            className="absolute top-1/2 right-[10px] -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          />
        </>
      )}

      {/* 페이지네이션 */}
      <Pagenation
        currentPage={current + 1}
        totalPages={images.length}
        className="absolute right-[10px] bottom-[10px]"
      />
    </div>
  );
};
