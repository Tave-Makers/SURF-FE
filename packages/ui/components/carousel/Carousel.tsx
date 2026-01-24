'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CarouselImage {
  src: string;
  alt: string;
  linkUrl?: string;
}

interface Props {
  images: CarouselImage[];
  className?: string;
  autoPlayMs?: number; // 0이면 자동재생 끔
}

export const Carousel = ({ images, className = '', autoPlayMs = 0 }: Props) => {
  const safeImages = useMemo(() => images.filter((v) => v?.src), [images]);
  const total = safeImages.length;

  const [index, setIndex] = useState(0);

  const clampIndex = useCallback(
    (next: number) => {
      if (total <= 0) return 0;
      return ((next % total) + total) % total; // 음수 대응
    },
    [total],
  );

  const goPrev = useCallback(() => setIndex((i) => clampIndex(i - 1)), [clampIndex]);
  const goNext = useCallback(() => setIndex((i) => clampIndex(i + 1)), [clampIndex]);

  // autoplay
  useEffect(() => {
    if (!autoPlayMs || autoPlayMs < 1000) return;
    if (total <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => clampIndex(i + 1));
    }, autoPlayMs);

    return () => window.clearInterval(id);
  }, [autoPlayMs, clampIndex, total]);

  if (total === 0) {
    return (
      <div
        className={[
          'rounded-5 shadow-embossed relative aspect-[343/150] min-h-[144px] w-full overflow-hidden',
          'bg-background-normal',
          className,
        ].join(' ')}
      />
    );
  }

  return (
    <div
      className={[
        'rounded-5 shadow-embossed group relative aspect-[343/150] min-h-[144px] w-full overflow-hidden',
        className,
      ].join(' ')}
    >
      {/* 1) 이미지 */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {safeImages.map((img, i) => {
          const content = (
            <div className="relative h-full w-full flex-shrink-0">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 343px"
              />
            </div>
          );

          return img.linkUrl ? (
            <a key={`${img.src}-${i}`} href={img.linkUrl} className="h-full w-full flex-shrink-0">
              {content}
            </a>
          ) : (
            <button
              key={`${img.src}-${i}`}
              type="button"
              className="h-full w-full flex-shrink-0"
              aria-label={img.alt}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* 2) dim */}
      <div className="from-background-carousel-start to-background-carousel-end pointer-events-none absolute inset-0 z-10 bg-gradient-to-b" />

      {/* 3)controlls, pagination */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-[10px] top-1/2 z-20 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="이전 배너"
          >
            <span className="relative inline-flex">
              <span className="absolute -inset-[0.8rem]" aria-hidden="true" />
              <span className="bg-background-carousel-pagenation flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-full">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground-static-white inline-block"
                >
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-[10px] top-1/2 z-20 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="다음 배너"
          >
            <span className="relative inline-flex">
              <span className="absolute -inset-[0.8rem]" aria-hidden="true" />
              <span className="bg-background-carousel-pagenation flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-full">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground-static-white inline-block"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </span>
          </button>

          <div className="rounded-max bg-background-carousel-pagenation text-caption-caption6 text-foreground-static-white absolute bottom-[10px] right-[10px] z-20 inline-flex items-center justify-center gap-6 px-7 py-3">
            <div>{index + 1}</div>
            <div className="bg-foreground-static-white h-[0.5rem] w-[0.0625rem]" />
            <div>{total}</div>
          </div>
        </>
      )}
    </div>
  );
};
