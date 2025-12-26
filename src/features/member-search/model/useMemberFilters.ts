'use client';

import { TrackPart } from '@/features/onboarding/model/types';
import { useState, useCallback } from 'react';

export function useMemberFilters() {
  const [keyword, setKeyword] = useState<string>('');
  const [generation, setGeneration] = useState<number | undefined>(undefined);
  const [part, setPart] = useState<TrackPart | undefined>(undefined);

  const resetFilters = useCallback(() => {
    setKeyword('');
    setGeneration(undefined);
    setPart(undefined);
  }, []);

  return {
    // state
    keyword,
    generation,
    part,

    // actions
    setKeyword,
    setGeneration,
    setPart,
    resetFilters,
  };
}
