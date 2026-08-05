import { useLayoutEffect, useRef, useState } from 'react';

interface UseDynamicVisibleCountProps<T> {
  items: T[];
  gap?: number;
  moreBadgeWidth?: number;
}

export const useDynamicVisibleCount = <T>({
  items,
  gap = 4,
  moreBadgeWidth = 28,
}: UseDynamicVisibleCountProps<T>) => {
  const [visibleCount, setVisibleCount] = useState(items.length);
  const containerRef = useRef<HTMLUListElement>(null);
  const ghostContainerRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const calculate = () => {
      if (!containerRef.current || !ghostContainerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const chipNodes = Array.from(ghostContainerRef.current.children) as HTMLElement[];

      let currentWidth = 0;
      let count = 0;

      for (let i = 0; i < chipNodes.length; i++) {
        const chipWidth = chipNodes[i].offsetWidth;
        const isLastItem = i === chipNodes.length - 1;
        const itemWidthWithGap = chipWidth + (i > 0 ? gap : 0);
        const nextTotalWidth = currentWidth + itemWidthWithGap;

        if (isLastItem) {
          if (nextTotalWidth <= containerWidth) {
            count++;
          }
        } else if (nextTotalWidth + gap + moreBadgeWidth <= containerWidth) {
          currentWidth = nextTotalWidth;
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(count);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [items.length, gap, moreBadgeWidth]);

  return {
    visibleCount,
    containerRef,
    ghostContainerRef,
  };
};
