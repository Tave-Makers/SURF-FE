'use client';

import type { ReactNode } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type Props<T extends { id?: string }> = {
  date?: Date; // 선택된 날짜
  items: T[]; // 해당 날짜의 이벤트 목록
  isLoading?: boolean; // 로딩 상태
  renderItem?: (item: T, index: number) => ReactNode; // 각 아이템을 어떻게 렌더링할지 주입
  headerAction?: ReactNode; // 섹션 헤더 오른쪽에 배치할 액션 영역
};

export function SelectedDayEventsSection<T extends { id?: string }>({
  date,
  items,
  isLoading,
  renderItem,
  headerAction,
}: Props<T>) {
  if (!date) return null;

  return (
    <section className="flex w-full flex-col gap-6 pt-15">
      <header className="flex items-center justify-between">
        <div className="text-body-body7 text-foreground-foreground-normal">
          {format(date, 'yyyy년 M월 d일 (E)', { locale: ko })}
        </div>
        {headerAction}
      </header>

      {isLoading ? (
        <div className="text-[#8A8F98]">불러오는 중...</div>
      ) : items.length === 0 ? (
        <div className="text-[#8A8F98]">등록된 일정이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((ev, i) => (
            <div key={ev?.id ?? i}>
              {renderItem
                ? renderItem(ev, i)
                : // : <EventCard event={ev} />
                  null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
