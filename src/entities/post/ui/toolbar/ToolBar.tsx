'use client';

import { ToolBarItems } from './ToolBarItems';
import { IconName } from '@/shared/ui/icon/SurfIcon';

type ToolBarItem = {
  key: string;
  label: string;
  icon: IconName;
};

type ToolBarProps = {
  items: ToolBarItem[];
  activeKey: string;
  onItemClick?: (key: string) => void;
  className?: string;
};

export function ToolBar({ items, activeKey, onItemClick, className = '' }: ToolBarProps) {
  return (
    <nav
      className={[
        'flex w-full items-center gap-15 px-13 py-8',
        'rounded-1 border-border-border-tertiary border-t-1 opacity-100',
        className,
      ].join(' ')}
    >
      {items.map((item) => (
        <ToolBarItems
          key={item.key}
          label={item.label}
          icon={item.icon}
          active={item.key === activeKey}
          onClick={() => {
            onItemClick?.(item.key);
          }}
        />
      ))}
    </nav>
  );
}
