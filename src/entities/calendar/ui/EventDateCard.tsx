import type { ReactNode } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * @param date - 선택된 날짜
 * @param items - 해당 날짜의 이벤트 목록
 * @param isLoading - 로딩 상태
 * @param renderItem - 각 아이템을 어떻게 렌더링할지 주입
 *
 * @example
 * <EventDateCard
 *   id="1"
 *   date={new Date('2025-11-20T00:00:00')}
 *   items={[{ id: '1', title: '후반기 만남의 장', type: 'official', startDate: new Date('2025-11-20T10:00:00'), endDate: new Date('2025-11-21T18:00:00'), place: '서울 강남구 어딘가' }]}
 *   isLoading={false}
 *   renderItem={(item, index) => <EventCard key={item.id ? item.id : index} {...item} />}
 * />
 */

type EventDateCardProps<T extends { id: string | number }> = {
  date: Date;
  items: T[];
  isLoading?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
};

export function EventDateCard<T extends { id: string | number }>({
  date,
  items,
  isLoading,
  renderItem,
}: EventDateCardProps<T>) {
  if (!date) return null;

  return (
    <div className="flex w-full flex-col gap-6 pt-15">
      <header className="flex items-start">
        <div className="text-body-body7 text-foreground-foreground-normal">
          {format(date, 'yyyy년 M월 d일 (E)', { locale: ko })}
        </div>
      </header>

      {isLoading ? (
        // text 색상은 임시값
        <div className="text-[#8A8F98]">불러오는 중...</div>
      ) : items.length === 0 ? (
        // text 색상은 임시값
        <div className="text-[#8A8F98]">등록된 일정이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-10">
          {items.map((ev, i) => (
            <div key={ev?.id ? ev.id : i}>{renderItem ? renderItem(ev, i) : null}</div>
          ))}
        </div>
      )}
    </div>
  );
}
