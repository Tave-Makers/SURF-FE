import type { DailyActivity } from '@/entities/calendar/model/types';
import { ActivityBadge } from '@/entities/calendar/ui/ActivityBadge/ActivityBadge';

type Props = {
  items: DailyActivity[];
  maxVisible?: number; // 셀 1칸에 보일 최대 태그 수
  isCurrentMonth?: boolean;
};

export function DailyActivityBadgeList({ items, maxVisible = 2, isCurrentMonth = true }: Props) {
  if (!items?.length) return null;

  const visible = items.slice(0, maxVisible);
  const remain = Math.max(items.length - visible.length, 0);

  return (
    <div className="flex h-full w-full min-w-0 flex-col items-start justify-center gap-3">
      {visible.map((it) => (
        <ActivityBadge key={it.id} item={it} isCurrentMonth={isCurrentMonth} />
      ))}
      {remain > 0 && (
        <div
          className={[
            'rounded-2 text-caption-caption6 flex max-w-full items-center justify-center px-2 py-4',
            isCurrentMonth
              ? 'text-foreground-secondary'
              : 'text-foreground-secondary-lighter opacity-50',
          ].join(' ')}
        >
          <span className="truncate">{remain}개 더보기</span>
        </div>
      )}
    </div>
  );
}
