'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function PathWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    // 설정 목록과 상세 페이지를 제외한 모든 곳에서 세션 정리
    const isSettings = pathname.startsWith('/settings');
    const isPostDetail = pathname.includes('/post/');

    if (!isSettings && !isPostDetail) {
      sessionStorage.removeItem('entry_path');
    }
  }, [pathname]);

  return null;
}
