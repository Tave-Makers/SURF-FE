'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [searchValue, setSearchValue] = useState('');

  // 경로 변경 시 검색값 초기화
  useEffect(() => {
    setSearchValue('');
  }, [pathname]);

  // 현재 경로에 맞는 route 설정 찾기
  const currentRoute = routeConfig.find((item) => pathname === item.path);

  // 경로 없으면 렌더 안 함 (404 대체)
  if (!currentRoute) return null;

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

  function getHeaderProps(header: HeaderProps, back: () => void): HeaderProps {
    if (header.mode === HeaderMode.SearchBar) {
      return {
        ...header,
        value: searchValue,
        onChange: setSearchValue,
        onSubmit: (value: string) => {
          console.log('검색:', value);
        },
        onClickBack: back,
      };
    }

    if (header.mode === HeaderMode.Logo || !header.hasLeftIcon) {
      return header;
    }

    return { ...header, onClickBack: back };
  }

  const baseHeader = overrideHeader ?? currentRoute.header;
  const headerProps = getHeaderProps(baseHeader, handleBack);

  return <Header {...headerProps} />;
}
