'use client';

import { TrackPart } from '@/entities/user/model/types';
import { useState, useCallback, useEffect } from 'react';

export function useMemberFilters() {
  const [keyword, setKeyword] = useState<string>('');
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  const [generation, setGeneration] = useState<number | undefined>(undefined);
  const [part, setPart] = useState<TrackPart | undefined>(undefined);

  useEffect(() => {
    // 300ms 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);

    // 사용자가 다음 글자를 입력하면 이전 타이머를 취소 (타이핑 중엔 실행 안 됨)
    return () => clearTimeout(timer);
  }, [keyword]);

  const resetFilters = useCallback(() => {
    setKeyword('');
    setGeneration(undefined);
    setPart(undefined);
  }, []);

  return {
    // state
    keyword, // UI용
    debouncedKeyword, // API용
    generation,
    part,

    // actions
    setKeyword,
    setGeneration,
    setPart,
    resetFilters,
  };
}
