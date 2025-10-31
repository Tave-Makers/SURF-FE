'use client';

import type { DailyActivity } from '@/entities/calendar/model/types';

type Props = { item: DailyActivity; isCurrentMonth?: boolean };

const colorByType: Record<DailyActivity['type'], string> = {
  official: 'bg-background-background-tag-pink text-foreground-foreground-tag-pink-darker',
  operation: 'bg-background-background-tag-purple text-foreground-foreground-tag-purple-darker',
  other: 'bg-background-background-tag-green text-foreground-foreground-tag-green-darker',
};

export function ActivityTagItem({ item, isCurrentMonth = true }: Props) {
  const baseClasses = 'flex w-full items-center rounded-2 px-2 py-3 text-caption-caption5 truncate';
  const opacityClass = isCurrentMonth ? '' : 'opacity-50';

  return (
    <div className={`${baseClasses} ${colorByType[item.type]} ${opacityClass}`}>{item.title}</div>
  );
}
