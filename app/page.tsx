'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  // 추후 로딩 페이지로 대체
  return <div>초기화 중...</div>;
}
