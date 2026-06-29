'use client';

import type { ReactNode } from 'react';

type ScoreFilterChipProps = {
  isSelected: boolean;
  children: ReactNode;
  onClick: () => void;
};

export const ScoreFilterChip = ({ isSelected, children, onClick }: ScoreFilterChipProps) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`rounded-max text-body-body9 border px-15 py-8 transition-colors ${
        isSelected
          ? 'border-background-secondary bg-background-secondary text-foreground-normal'
          : 'border-border-quaternary bg-background-normal text-foreground-normal'
      }`}
    >
      {children}
    </button>
  );
};
