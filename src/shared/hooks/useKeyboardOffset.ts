'use client';

import { useEffect, useState } from 'react';

/**
 * 모바일 기기에서 키보드가 올라올 때 viewport 변화에 따라
 * 키보드 높이를 계산해 반환하는 훅.
 * - iOS Safari, 인앱 브라우저, Android 모두 동작
 */
export function useKeyboardOffset() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const onResize = () => {
      // 키보드 높이 = 전체 높이 - 실제 viewport 높이 - offsetTop
      const heightDiff = window.innerHeight - viewport.height - viewport.offsetTop;
      setKeyboardOffset(heightDiff > 0 ? heightDiff : 0);
    };

    viewport.addEventListener('resize', onResize);
    viewport.addEventListener('scroll', onResize); // 일부 브라우저는 scroll 발생

    return () => {
      viewport.removeEventListener('resize', onResize);
      viewport.removeEventListener('scroll', onResize);
    };
  }, []);

  return keyboardOffset;
}
