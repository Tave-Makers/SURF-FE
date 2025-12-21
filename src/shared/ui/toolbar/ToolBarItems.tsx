'use client';

import { MouseEventHandler } from 'react';
import { SurfIcon, IconName } from '@/shared/ui/icon/SurfIcon';

interface ToolBarItemsProps {
  label: string;
  icon: IconName;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const baseStyle = 'text-foreground-normal inline-flex items-center gap-5 focus:outline-none';

export function ToolBarItems({ label, icon, onClick, active }: ToolBarItemsProps) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={baseStyle}>
      <SurfIcon name={icon} size="m" />
      <span className="text-body-body10">{label}</span>
    </button>
  );
}
