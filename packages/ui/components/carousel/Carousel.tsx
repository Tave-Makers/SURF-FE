'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pagenation } from '../pagenation/Pagenation';
import { Control } from './Control';

interface CarouselImage {
  src: string;
  alt: string;
  linkUrl?: string;
  displayOrder?: number;
}

interface CarouselProps {
  images: CarouselImage[];
  className?: string;
}

const baseStyle =
  'rounded-5 aspect-[343/150] w-full min-w-[343px] relative overflow-hidden from-background-carousel-start to-background-carousel-end bg-gradient-to-b shadow-embossed';

export const Carousel = ({ images, className = '' }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      // displayOrder 없는 경우는 뒤로
      if (a.displayOrder == null && b.displayOrder == null) return 0;
      if (a.displayOrder == null) return 1;
      if (b.displayOrder == null) return -1;
      return a.displayOrder - b.displayOrder;
    });
  }, [images]);
  const length = sortedImages.length;

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
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  // 우측 버튼
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % length);
  };

  if (length === 0) {
    return <div className={`${baseStyle} ${className}`} />;
  }

  return (
    <div className={`${baseStyle} ${className} group`}>
      <div className="bg-background-normal z-[-10]">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {sortedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!img.linkUrl) return;
                window.open(img.linkUrl, '_blank');
              }}
              className="relative h-full w-full flex-shrink-0"
            >
              <Image src={img.src} alt={img.alt} fill className="object-contain object-center" />
            </button>
          ))}
        </div>

        {length > 1 && (
          <>
            {/* 좌측 버튼 */}
            <Control
              direction="left"
              onClick={handlePrev}
              className="absolute left-[10px] top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            />

            {/* 우측 버튼 */}
            <Control
              direction="right"
              onClick={handleNext}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </>
        )}

        {/* 페이지네이션 */}
        <Pagenation
          currentPage={current + 1}
          totalPages={length}
          className="absolute bottom-[10px] right-[10px]"
        />
      </div>
    </div>
  );
};
