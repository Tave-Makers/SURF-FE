'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Header, HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { ROUTE_CONFIG } from '@/shared/config/routes';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // 현재 경로에 맞는 route 설정 찾기
  const currentRoute = ROUTE_CONFIG.find((item) => pathname === item.path);

  // 추후 404 페이지로 대체
  if (!currentRoute) return null;

  function getHeaderProps(header: HeaderProps, back: () => void): HeaderProps {
    if (header.mode === HeaderMode.Logo || !header.hasLeftIcon) return header;
    return { ...header, onClickBack: back };
  }

  const headerProps = getHeaderProps(currentRoute.header, () => router.back());

  return <Header {...headerProps} />;
}
