'use client';

import { Header, HeaderMode, HeaderProps } from '@surf/ui/header';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { PAGE_ROUTES } from '@/shared/config/path';
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
  const currentRoute = routeConfig.find((item) =>
    typeof item.path === 'string' ? pathname === item.path : item.path.test(pathname),
  );

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
        const { backPath } = currentRoute;
        router.push(typeof backPath === 'function' ? backPath(pathname) : backPath);
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

  const headerWithHomeLink =
    baseHeader.mode === HeaderMode.Logo
      ? {
          ...baseHeader,
          logo: (
            <button
              type="button"
              onClick={() => {
                if (pathname !== PAGE_ROUTES.HOME) {
                  router.push(PAGE_ROUTES.HOME);
                }
              }}
              className="flex h-full items-center border-none bg-transparent p-0"
              aria-label="홈으로 이동"
            >
              {baseHeader.logo}
            </button>
          ),
        }
      : baseHeader;

  const headerProps = getHeaderProps(headerWithHomeLink, handleBack);

  return <Header {...headerProps} className={className} />;
};
