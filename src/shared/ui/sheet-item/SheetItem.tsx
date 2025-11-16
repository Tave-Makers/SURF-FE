'use client';

import type { ReactNode } from 'react';

type SheetItemProps = {
  title: string;
  node?: ReactNode;
  onClick?: () => void;
  textColor?: 'normal' | 'danger';
};

export function SheetItem({ title, node, onClick, textColor = 'normal' }: SheetItemProps) {
  const textColorClass =
    textColor === 'danger'
      ? 'text-foreground-foreground-danger'
      : 'text-foreground-foreground-normal';

  return (
    <button onClick={onClick} className="flex w-full items-center gap-8 px-12 py-10">
      {/* Left Node */}
      <div className="flex h-[1.5rem] w-[1.5rem] items-center justify-center">{node}</div>

      {/* Title */}
      <span className={`text-body-body5 ${textColorClass}`}>{title}</span>
    </button>
  );
}
