'use client';

import React from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { BOTTOM_NAV_ITEMS } from '@/shared/config/bottom-nav';

interface BottomNavigationProps {
  activeId: string;
  onNavigate: (id: string) => void; // 클릭 시 id만 전달
}

const navStyle =
  'bg-background-normal-lighter rounded-t-5 shadow-embossed-inverse bottom-0 left-0 flex w-full justify-around pb-13';
const buttonStyle = 'flex flex-1 cursor-pointer flex-col items-center gap-6 pt-13';

export function BottomNavigation({ activeId, onNavigate }: BottomNavigationProps) {
  return (
    <nav role="navigation" aria-label="하단 네비게이션" className={navStyle}>
      {BOTTOM_NAV_ITEMS.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)} className={buttonStyle}>
          <SurfIcon
            name={activeId === item.id ? item.activeIcon : item.defaultIcon}
            size="l"
            className={activeId === item.id ? 'text-foreground-primary' : 'text-foreground-quinary'}
          />
          <span
            className={
              activeId === item.id
                ? 'text-caption-caption6 text-foreground-primary-darker'
                : 'text-caption-caption6 text-foreground-quinary-darker'
            }
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
