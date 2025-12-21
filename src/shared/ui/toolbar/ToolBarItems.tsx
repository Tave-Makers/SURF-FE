'use client';

import { MouseEventHandler } from 'react';
import { SurfIcon, IconName } from '@/shared/ui/icon/SurfIcon';

type ToolBarItemsProps = {
  label: string;
  icon: IconName;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function ToolBarItems({ label, icon, onClick, active }: ToolBarItemsProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={'text-foreground-normal inline-flex items-center gap-5 focus:outline-none'}
    >
      <SurfIcon name={icon} size="m" />
      <span className="text-body-body9">{label}</span>
    </button>
  );
}
