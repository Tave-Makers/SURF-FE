'use client';

import { MouseEventHandler } from 'react';
import { SurfIcon, IconName } from '@/shared/ui/icon/SurfIcon';

interface ToolBarItemsProps {
  label: string;
  icon: IconName;
  active?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function ToolBarItems({ label, icon, onClick, active, disabled }: ToolBarItemsProps) {
  const baseStyle = 'text-foreground-normal inline-flex items-center gap-5 focus:outline-none';

  const statusStyle = disabled ? 'opacity-30' : 'opacity-100';

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={disabled ? undefined : onClick}
      className={`${baseStyle} ${statusStyle}`}
      disabled={disabled}
    >
      <SurfIcon name={icon} size="m" />
      <span className="text-body-body10">{label}</span>
    </button>
  );
}
