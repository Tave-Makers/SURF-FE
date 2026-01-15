'use client';

import { useEffect, useRef, useCallback } from 'react';

type Props = {
  enabled?: boolean;
  hasNextPage?: boolean;
  isFetching?: boolean;
  onLoadMore: () => void;
};

export function useInfiniteScroll({
  enabled = true,
  hasNextPage = false,
  isFetching = false,
  onLoadMore,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const callback = useCallback(() => {
    if (!enabled || !hasNextPage || isFetching) return;
    onLoadMore();
  }, [enabled, hasNextPage, isFetching, onLoadMore]);

  useEffect(() => {
    if (!ref.current) return;
    const target = ref.current;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        callback();
      }
    });

    observer.observe(target);

    return () => observer.unobserve(target);
  }, [callback]);

  return ref;
}
