'use client';
import type { DailyActivity } from './types';
import { ActivityTagItem } from './ActivityTagItem';

type Props = {
  items: DailyActivity[];
  maxVisible?: number; // 셀 1칸에 보일 최대 태그 수
};

export function DailyActivityTagList({ items, maxVisible = 2 }: Props) {
  if (!items?.length) return null;

  const visible = items.slice(0, maxVisible);
  const remain = Math.max(items.length - visible.length, 0);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      {visible.map((it) => (
        <ActivityTagItem key={it.id} item={it} />
      ))}
      {remain > 0 && (
        <div className="rounded-2 text-caption-caption5 text-foreground-foreground-secondary-lighter flex max-w-full items-center truncate px-2 py-3">
          {remain}개 더보기
        </div>
      )}
    </div>
  );
}
