'use client';
import React from 'react';
import { SurfIcon } from '../icon/SurfIcon';

const navItems = [
  { id: 'home', label: '홈', activeIcon: 'HomeSolid', defaultIcon: 'Home' },
  { id: 'chat', label: '커피챗', activeIcon: 'ChatSolid', defaultIcon: 'Chat' },
  { id: 'mypage', label: '마이페이지', activeIcon: 'SmileCircleSolid', defaultIcon: 'SmileCircle' },
] as const;

type BottomNavigationProps = {
  activeId: string;
  onNavigate: (id: string) => void; // 클릭 시 id만 전달
};

export function BottomNavigation({ activeId, onNavigate }: BottomNavigationProps) {
  return (
    <nav
      role="navigation"
      aria-label="하단 네비게이션"
      className="bg-background-normal bottom-0 left-0 flex h-[4.5rem] w-full justify-around rounded-t-[0.625rem] pb-[0.75rem] shadow-[0_2px_30px_0_rgba(0,0,0,0.10)]"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="flex flex-1 cursor-pointer flex-col items-center gap-[0.31rem] py-[0.62rem]"
        >
          <SurfIcon
            name={activeId === item.id ? item.activeIcon : item.defaultIcon}
            size="l"
            className={activeId === item.id ? 'text-foreground-primary' : 'text-foreground-hint'}
          />
          <span
            className={
              activeId === item.id
                ? 'text-caption-10-400--1 text-foreground-primary'
                : 'text-caption-10-400--1 text-foreground-hint'
            }
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
