'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SurfIcon } from '@surf/ui/icon';
import { BOTTOM_NAV_ITEMS, type TabId } from '../model/config';

const navStyle =
  'bottom-0 left-0 bg-background-normal-lighter rounded-t-5 shadow-embossed-inverse flex w-full justify-around pb-13';
const linkStyle = 'flex flex-1 flex-col items-center gap-6 pt-13';

export function AppNavigation() {
  const pathname = usePathname();

  const activeId: TabId =
    BOTTOM_NAV_ITEMS.find((item) =>
      item.relatedRoots.some((root) => {
        if (root === '/') return pathname === '/';
        return pathname?.startsWith(root);
      }),
    )?.id ?? 'home';

  return (
    <nav aria-label="하단 네비게이션" className={navStyle}>
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;

        return (
          <Link
            key={item.id}
            href={item.path}
            aria-current={isActive ? 'page' : undefined}
            className={linkStyle}
          >
            <SurfIcon
              name={isActive ? item.icons.active : item.icons.default}
              size="l"
              className={isActive ? 'text-foreground-primary' : 'text-foreground-quinary'}
            />
            <span
              className={
                isActive
                  ? 'text-caption-caption6 text-foreground-primary-darker'
                  : 'text-caption-caption6 text-foreground-quinary-darker'
              }
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
