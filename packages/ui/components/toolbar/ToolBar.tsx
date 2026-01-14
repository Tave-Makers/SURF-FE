'use client';

import { IconName } from '../icon/SurfIcon';
import { ToolBarItems } from './ToolBarItems';

export type ToolBarItem<K extends string> = {
  key: K;
  label: string;
  icon: IconName;
  active?: boolean;
  disabled?: boolean;
};

type ToolBarProps<K extends string> = {
  items: ToolBarItem<K>[];
  onItemClick?: (key: K) => void;
  className?: string;
};

export function ToolBar<K extends string>({ items, onItemClick, className = '' }: ToolBarProps<K>) {
  return (
    <nav
      className={[
        'gap-15 px-13 flex w-full items-center py-8',
        'rounded-1 border-border-tertiary border-t-1 opacity-100',
        className,
      ].join(' ')}
    >
      {items.map((item) => (
        <ToolBarItems
          key={item.key}
          label={item.label}
          icon={item.icon}
          active={item.active}
          disabled={item.disabled}
          onClick={() => {
            onItemClick?.(item.key);
          }}
        />
      ))}
    </nav>
  );
}
