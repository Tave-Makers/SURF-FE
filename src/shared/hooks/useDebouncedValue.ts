'use client';

import { useEffect, useState } from 'react';

// 빠른 UI 피드백 위해 100으로 설정
export function useDebouncedValue<T>(value: T, delay = 100) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
