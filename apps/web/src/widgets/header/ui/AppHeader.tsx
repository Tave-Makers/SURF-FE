'use client';

import { Header, HeaderMode, HeaderProps } from '@surf/ui/header';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { createRouteConfig } from '@/shared/config/routes';

type AppHeaderProps = {
  customBack?: () => void;
  overrideHeader?: HeaderProps | null;
  className?: string;
};

export const AppHeader = ({ customBack, overrideHeader, className }: AppHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const routeConfig = useMemo(() => createRouteConfig(router), [router]);

  // 현재 경로에 맞는 route 설정 찾기
  const currentRoute = routeConfig.find((item) => pathname === item.path);

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

  return <Header {...headerProps} className={className} />;
};
