import type { DailyActivity } from '@/entities/calendar/model/types';

type Props = { item: DailyActivity; isCurrentMonth?: boolean };

const labelByType: Record<DailyActivity['category'], string> = {
  official: '정규행사',
  operation: '운영회의',
  other: '기타일정',
};

const colorByType: Record<DailyActivity['category'], string> = {
  official: 'bg-background-badge-pink text-foreground-badge-pink-darker',
  operation: 'bg-background-badge-purple text-foreground-badge-purple-darker',
  other: 'bg-background-badge-green text-foreground-badge-green-darker',
};

export function CalendarActivityBadge({ item, isCurrentMonth = true }: Props) {
  const baseClasses =
    'flex w-full min-w-0 items-center inline-flex rounded-2 px-2 py-3 text-caption-caption5 flex-shrink-0';
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
