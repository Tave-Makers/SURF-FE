'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pagenation } from '../pagenation/Pagenation';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

interface CarouselImage {
  src: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
  className?: string;
}

const baseStyle =
  'rounded-5 w-full h-[150px] relative overflow-hidden bg-white bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.3)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]';

export const Carousel = ({ images, className = '' }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    // 이전 타미어 존재하면 제거
    if (timerRef.current) clearTimeout(timerRef.current);

    // 4초 후 다음 이미지로 이동
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
  }, [images.length]);

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

  return (
    <div className={`${baseStyle} ${className}`}>
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="rounded-5 h-full w-full object-cover"
      />

      {/* 좌측 버튼 */}
      <button onClick={handlePrev} className="absolute top-1/2 left-[10px] -translate-y-1/2">
        <SurfIcon name="ChevronLeft" size="s" />
      </button>

      {/* 우측 버튼 */}
      <button onClick={handleNext} className="absolute top-1/2 right-[10px] -translate-y-1/2">
        <SurfIcon name="ChevronRight" size="s" />
      </button>

      {/* 페이지네이션 */}
      <Pagenation
        currentPage={current + 1}
        totalPages={images.length}
        className="absolute right-[10px] bottom-[10px]"
      />
    </div>
  );
};
