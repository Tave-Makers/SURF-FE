import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SurfIcon } from '../../../shared/ui/icon/SurfIcon';
import { CalendarTag } from '@/entities/calendar/ui/CalendarTag';

type EventCardProps = {
  title: string;
  type: 'official' | 'operation' | 'other';
  startDate?: Date | null;
  endDate?: Date | null;
  place: string;
  onClickCard?: () => void; // 카드 전체 클릭 (공지사항 바로가기)
};

// 날짜 포맷팅 함수
const formatEventDate = (date: Date | null | undefined) => {
  // date가 null, undefined이거나 유효하지 않은 Date 객체인 경우 '미정' 반환
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '미정';
  } // 'MM월 dd일 (eee) HH:mm' 형식으로 변환
  return format(date, 'MM월 dd일 (eee) HH:mm', { locale: ko });
};

export function EventCard({ title, type, startDate, endDate, place, onClickCard }: EventCardProps) {
  // 카드 전체 클릭 (공지사항 바로가기)
  const handleCardClick = () => {
    onClickCard?.();
    console.log('EventCard clicked');
  };

  return (
    <button
      onClick={handleCardClick}
      className="rounded-4 border-border-border-quinary bg-background-background-normal-lighter flex w-full flex-1 cursor-pointer flex-col items-start gap-8 self-stretch border-[1px] px-13 py-11"
    >
      {/* Header 영역 */}
      <section className="flex items-start gap-8 self-stretch">
        <div className="flex flex-1 flex-col items-start gap-10">
          <CalendarTag variation={type} />
        </div>

        <div className="flex h-[1.18rem] flex-row items-center gap-3">
          <div className="text-caption-caption5 text-foreground-foreground-tertiary">
            공지사항 바로가기
          </div>
          <SurfIcon size="s" name="ChevronRight" className="text-foreground-foreground-tertiary" />
        </div>
      </section>

      {/* Container 영역 */}
      <section className="flex w-full flex-1 flex-col items-start">
        {/* 일정 제목 */}
        <div className="text-body-body3 text-foreground-foreground-normal">{title}</div>

        <div className="flex flex-col items-start self-stretch pt-5">
          {/* 날짜 */}
          <div className="text-body-body8 text-foreground-foreground-normal-lighter flex items-center gap-5 self-stretch">
            <div>{formatEventDate(startDate)}</div>
            <div>~</div>
            <div>{formatEventDate(endDate)}</div>
          </div>

          {/* 장소 */}
          <div className="text-caption-caption2 text-foreground-foreground-normal-lighter flex items-center gap-5">
            <div>장소 :</div>
            <div>{place}</div>
          </div>
        </div>
      </section>
    </button>
  );
}
