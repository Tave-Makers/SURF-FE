import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SurfIcon } from '../../../shared/ui/icon/SurfIcon';
import { CalendarTag } from '@/entities/calendar/ui/CalendarTag';
import { ActivityType, EventCardType } from '../model/types';

/**
 * 이벤트 카드 컴포넌트
 * @param title - 이벤트 제목
 * @param type - 이벤트 유형 (ActivityType: 'official', 'operation', 'other' 중 하나)
 * @param mode - 이벤트 카드 모드 (EventCardType: 'closeBtn', 'normal', 'varogaggi' 중 하나)
 * @param startDate - 이벤트 시작 날짜 (Date 객체)
 * @param endDate - 이벤트 종료 날짜 (Date 객체)
 * @param place - 이벤트 장소
 * @param onClickCard - 카드 전체 클릭 시 호출되는 콜백 함수 (공지사항 바로가기)
 *
 * @methods formatEventDate - 날짜를 'MM월 dd일 (eee) HH:mm' 형식으로 포맷팅하는 함수
 *
 * @example
 * <EventCard
 *   title="후반기 만남의 장소"
 *   type="official"
 *   startDate={new Date('2025-11-20T10:00:00')}
 *   endDate={new Date('2025-11-21T18:00:00')}
 *   place="서울 강남구 어딘가"
 *   onClickCard={() => console.log('Card clicked!')}
 * />
 */

type EventCardProps = {
  title: string;
  type: ActivityType;
  mode: EventCardType;
  startDate?: Date | null;
  endDate?: Date | null;
  place: string;
  onClickCard?: () => void; // 카드 전체 클릭 (공지사항 바로가기)
};

// 날짜 포맷팅 함수
const formatEventDate = (date: Date | null | undefined) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '미정';
  }
  return format(date, 'MM월 dd일 (eee) HH:mm', { locale: ko });
};

const deleteSchedule = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Delete schedule clicked');
  }
};

export function EventCard({
  title,
  type,
  mode,
  startDate,
  endDate,
  place,
  onClickCard,
}: EventCardProps) {
  const handleCardClick = () => {
    if (mode === 'varogaggi') {
      onClickCard?.();

      if (process.env.NODE_ENV === 'development') {
        console.log('EventCard clicked');
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleCardClick}
      className="rounded-4 border-border-border-quinary bg-background-background-normal-lighter flex w-full flex-1 cursor-pointer flex-col items-start gap-8 border-[1px] px-13 py-11"
    >
      {/* Header 영역 */}
      <section className="flex items-start gap-8 self-stretch">
        <div className="flex flex-1 flex-col items-start gap-10">
          <CalendarTag variation={type} />
        </div>

        {mode === 'closeBtn' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSchedule();
            }}
          >
            <SurfIcon size="m" name="X" className="text-foreground-foreground-normal-lighter" />
          </button>
        )}

        {mode === 'varogaggi' && (
          <div className="flex h-[1.18rem] flex-row items-center gap-3">
            <div className="text-caption-caption5 text-foreground-foreground-tertiary">
              공지사항 바로가기
            </div>
            <SurfIcon
              size="s"
              name="ChevronRight"
              className="text-foreground-foreground-tertiary"
            />
          </div>
        )}
      </section>

      {/* Container 영역 */}
      <section className="flex w-full flex-1 flex-col items-start">
        {/* 일정 제목 */}
        <div className="text-body-body3 text-foreground-foreground-normal">{title}</div>

        <div className="flex flex-col items-start pt-5">
          {/* 날짜 */}
          <div className="text-body-body8 text-foreground-foreground-normal-lighter flex items-center gap-5">
            <div>{formatEventDate(startDate)}</div>
            <div>~</div>
            <div>{formatEventDate(endDate)}</div>
          </div>

          {/* 장소 */}
          <div className="text-caption-caption2 text-foreground-foreground-normal-lighter flex items-center gap-5">
            <div>장소 :</div>
            <div>{place ? place : '미정'}</div>
          </div>
        </div>
      </section>
    </button>
  );
}
