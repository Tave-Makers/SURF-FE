import { useEffect, useRef, useCallback } from 'react';

interface AbortableLifeCycle {
  isActive: () => boolean;
  startRequest: () => AbortSignal;
  abort: () => void;
}

export function useAbortableLifeCycle(): AbortableLifeCycle {
  const mountedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const isActive = useCallback(() => {
    return mountedRef.current && !abortRef.current?.signal.aborted;
  }, []);

  const startRequest = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    return abortRef.current.signal;
  }, []);

  const abort = useCallback(() => abortRef.current?.abort(), []);

  return { isActive, startRequest, abort };
}
