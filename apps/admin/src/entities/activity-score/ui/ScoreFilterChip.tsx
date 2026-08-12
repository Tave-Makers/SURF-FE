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
      className={`rounded-max text-body-body9 text-foreground-normal border px-13 py-8 transition-colors ${
        isSelected
          ? 'border-border-secondary bg-background-secondary-darker'
          : 'border-border-normal bg-background-normal-lighter'
      }`}
    >
      {children}
    </button>
  );
};
