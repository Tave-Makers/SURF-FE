'use client';

import { MouseEventHandler } from 'react';
import { SurfIcon, IconName } from '@/shared/ui/icon/SurfIcon';

type ToolBarItemsProps = {
  label: string;
  icon: IconName;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: boolean;
};

export function ToolBarItems({ label, icon, active = false, onClick }: ToolBarItemsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'text-foreground-foreground-normal inline-flex items-center gap-5 focus:outline-none'
      }
    >
      <SurfIcon name={icon} size="m" />
      <span className="text-body-body9">{label}</span>
    </button>
  );
}
