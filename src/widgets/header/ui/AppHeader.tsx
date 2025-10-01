'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header, HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { createRouteConfig } from '@/shared/config/routes';

export function AppHeader({ customBack }: { customBack?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const routeConfig = useMemo(() => createRouteConfig(router), [router]);

  // 현재 경로에 맞는 route 설정 찾기
  const currentRoute = routeConfig.find((item) => pathname === item.path);

  // 추후 404 페이지로 대체
  if (!currentRoute) return null;

  function getHeaderProps(header: HeaderProps, back: () => void): HeaderProps {
    if (header.mode === HeaderMode.Logo || !header.hasLeftIcon) return header;
    return { ...header, onClickBack: back };
  }

  // 뒤로가기 동작
  const handleBack = () => {
    if (customBack) {
      customBack();
      return;
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(currentRoute.backPath);
    }
  };

  const headerProps = getHeaderProps(currentRoute.header, handleBack);

  return <Header {...headerProps} />;
}
