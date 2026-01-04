import { useEffect, useRef, useCallback } from 'react';

export function useAbortableLifeCycle() {
  const mountedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    if (!abortRef.current) {
      abortRef.current = new AbortController();
    }

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const isAlive = useCallback(() => mountedRef.current && !abortRef.current?.signal.aborted, []);

  const getSignal = useCallback(() => {
    if (!abortRef.current) abortRef.current = new AbortController();
    return abortRef.current.signal;
  }, []);

  const abort = useCallback(() => abortRef.current?.abort(), []);

  return { isAlive, getSignal, abort };
}
