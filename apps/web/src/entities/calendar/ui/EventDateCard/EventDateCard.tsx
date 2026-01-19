import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ReactNode } from 'react';
import CalendarEventDateCardEmpty from '@/shared/assets/icons/empty-space/calendar-event-date-card-empty.svg';

/**
 * @param date - 선택된 날짜
 * @param items - 해당 날짜의 이벤트 목록
 * @param isLoading - 로딩 상태
 * @param renderItem - 각 아이템을 어떻게 렌더링할지 주입
 */

type EventDateCardProps<T extends { id: string | number }> = {
  date: Date;
  items: T[];
  isLoading?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
};

export const EventDateCard = <T extends { id: string | number }>({
  date,
  items,
  isLoading,
  renderItem,
}: EventDateCardProps<T>) => {
  if (!date) return null;
  const formattedDate = format(date, 'yyyy년 M월 d일 (E)', { locale: ko });

  return (
    <div className="flex w-full flex-col gap-6 pt-15">
      <header className="flex items-start">
        <div className="text-body-body8 text-foreground-normal">{formattedDate}</div>
      </header>

      {isLoading ? (
        <div className="text-background-secondary-darker">불러오는 중...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 pt-[2.19rem]">
          <CalendarEventDateCardEmpty />
          <div className="text-body-body8 text-foreground-tertiary">등록된 일정이 없어요</div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {items.map((item, index) => (
            <div key={item.id}>{renderItem(item, index)}</div>
          ))}
        </div>
      )}
    </div>
  );
};
