import type { DailyActivity } from '@/entities/calendar/model/types';

type Props = { item: DailyActivity; isCurrentMonth?: boolean };

const labelByType: Record<DailyActivity['category'], string> = {
  official: '공식 일정',
  operation: '운영 일정',
  other: '기타 일정',
};

const colorByType: Record<DailyActivity['category'], string> = {
  official: 'bg-background-tag-pink text-foreground-tag-pink-darker',
  operation: 'bg-background-tag-purple text-foreground-tag-purple-darker',
  other: 'bg-background-tag-green text-foreground-tag-green-darker',
};

export function ActivityBadge({ item, isCurrentMonth = true }: Props) {
  const baseClasses =
    'flex w-full min-w-0 items-center inline-flex rounded-2 px-2 py-3 text-caption5 flex-shrink-0';
  const opacityClass = isCurrentMonth ? '' : 'opacity-50';

  return (
    <div
      className={`${baseClasses} ${colorByType[item.category]} ${opacityClass}`}
      aria-label={`${labelByType[item.category]}: ${item.title}`}
    >
      <span className="truncate">{item.title}</span>
    </div>
  );
}
