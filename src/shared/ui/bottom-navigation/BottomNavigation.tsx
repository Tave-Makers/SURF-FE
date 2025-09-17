import React, { useState } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

const navItems = [
  { id: 'home', label: '홈', activeIcon: 'HomeSolid', defaultIcon: 'Home' },
  { id: 'chat', label: '커피챗', activeIcon: 'ChatSolid', defaultIcon: 'Chat' },
  { id: 'mypage', label: '마이페이지', activeIcon: 'SmileCircleSolid', defaultIcon: 'SmileCircle' },
] as const;

export default function BottomNavigation() {
  const [active, setActive] = useState('home');

  return (
    <nav className="absolute bottom-0 left-0 flex h-[4.5rem] w-full justify-around rounded-t-[0.625rem] bg-[var(--color-background-normal)] pb-[0.75rem] shadow-[0_2px_30px_0_rgba(0,0,0,0.10)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className="flex flex-1 cursor-pointer flex-col items-center gap-[0.31rem] py-[0.62rem]"
        >
          {active === item.id ? (
            <SurfIcon
              name={item.activeIcon}
              size="l"
              className="text-[color:var(--color-foreground-primary)]"
            />
          ) : (
            <SurfIcon
              name={item.defaultIcon}
              size="l"
              className="text-[color:var(--color-foreground-hint)]"
            />
          )}
          <span
            className={
              active === item.id
                ? 'text-caption-10-400--1 text-[color:var(--color-foreground-primary)]'
                : 'text-caption-10-400--1 text-[color:var(--color-foreground-hint)]'
            }
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
