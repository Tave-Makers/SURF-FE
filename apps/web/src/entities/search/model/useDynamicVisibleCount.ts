import { useState, useRef, useLayoutEffect } from 'react';

interface UseDynamicVisibleCountProps<T> {
  items: T[]; // 측정할 아이템 배열
  gap?: number; // 아이템 사이의 간격 (px)
  moreBadgeWidth?: number; // '+N' 배지가 차지할 예상 너비 (px)
}

export const useDynamicVisibleCount = <T>({
  items,
  gap = 4,
  moreBadgeWidth = 28,
}: UseDynamicVisibleCountProps<T>) => {
  // 실제 보여줄 개수 상태
  const [visibleCount, setVisibleCount] = useState(items.length);

  // 컨테이너와 Ghost 요소를 연결할 Ref
  const containerRef = useRef<HTMLUListElement>(null);
  const ghostContainerRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const calculate = () => {
      if (!containerRef.current || !ghostContainerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      // Ghost 컨테이너의 자식들(칩)의 DOM 요소 가져오기
      const chipNodes = Array.from(ghostContainerRef.current.children) as HTMLElement[];

      let currentWidth = 0;
      let count = 0;

      for (let i = 0; i < chipNodes.length; i++) {
        const chipWidth = chipNodes[i].offsetWidth;
        const isLastItem = i === chipNodes.length - 1;

        // 아이템이 추가될 때마다 너비 누적 (첫 아이템이 아니면 gap 추가)
        const itemWidthWithGap = chipWidth + (i > 0 ? gap : 0);
        const nextTotalWidth = currentWidth + itemWidthWithGap;

        // 로직:
        // 1. 마지막 아이템인 경우: 그냥 컨테이너 안에 들어가는지만 확인
        // 2. 중간 아이템인 경우: 이 아이템 + (+N 배지 너비)가 들어갈 공간이 있는지 확인

        if (isLastItem) {
          if (nextTotalWidth <= containerWidth) {
            count++;
          }
        } else {
          // 다음 아이템이 더 있으므로, '+N' 배지 공간도 확보해야 함 (gap 포함)
          if (nextTotalWidth + gap + moreBadgeWidth <= containerWidth) {
            currentWidth = nextTotalWidth;
            count++;
          } else {
            // 공간 부족하면 여기서 카운팅 멈춤
            break;
          }
        }
      }

      setVisibleCount(count);
    };

    // 초기 계산
    calculate();

    // 리사이즈 감지
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
