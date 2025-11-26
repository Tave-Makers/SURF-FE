'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header, HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { createRouteConfig } from '@/shared/config/routes';

type AppHeaderProps = {
  customBack?: () => void;
  overrideHeader?: HeaderProps | null;
};

export function AppHeader({ customBack, overrideHeader }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const routeConfig = useMemo(() => createRouteConfig(router), [router]);

  // routeConfig 내 path가 현재 pathname과 일치하는지 검사
  // 동적 세그먼트는 정규식으로 변환하여 매칭
  const currentRoute = routeConfig.find((item) => {
    if (pathname === item.path) return true;
    const regex = new RegExp('^' + item.path.replace(/\[.*?\]/g, '[^/]+') + '$');
    return regex.test(pathname);
  });

  // 뒤로가기 동작
  const handleBack = () => {
    if (customBack) {
      customBack();
      return;
    }
    if (currentRoute) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(currentRoute.backPath);
      }
    } else {
      if (window.history.length > 1) router.back();
    }
  };

  function getHeaderProps(header: HeaderProps, back: () => void): HeaderProps {
    if (header.mode === HeaderMode.Logo || !header.hasLeftIcon) return header;
    return { ...header, onClickBack: back };
  }

  const baseHeader = overrideHeader ?? currentRoute?.header ?? null;

  if (!baseHeader) return null;

  const headerProps = getHeaderProps(baseHeader, handleBack);

  return <Header {...headerProps} />;
}
