'use client';

import { useEffect, useRef, useCallback } from 'react';

type Props = {
  enabled?: boolean;
  hasNextPage?: boolean;
  isFetching?: boolean;
  root?: Element | null;
  onLoadMore: () => void;
};

export function useInfiniteScroll({
  enabled = true,
  hasNextPage = false,
  isFetching = false,
  root = null,
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

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        if (entry.isIntersecting) {
          callback();
        }
      },
      { root },
    );

    observer.observe(target);

    return () => observer.unobserve(target);
  }, [callback, root]);

  return ref;
}
