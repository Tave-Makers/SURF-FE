'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { CalendarBadge } from '@/entities/calendar/ui/CalendarBadge/CalendarBadge';
import { ScheduleActionSheet } from '@/entities/calendar/ui/ScheduleActionSheet/ScheduleActionSheet';
import { ActivityCategory, EventCardType } from '@/entities/calendar/model/types';

/**
 * 이벤트 카드 컴포넌트
 * @param id - 일정 이벤트 고유 ID
 * @param category - 일정 이벤트 유형 (ActivityCategory: 'official', 'operation', 'other' 중 하나)
 * @param scheduleId - 일정 ID (바텀 시트 오픈 시 필요)
 * @param title - 일정 이벤트 제목
 * @param startDate - 일정 이벤트 시작 날짜 (Date 객체)
 * @param endDate - 일정 이벤트 종료 날짜 (Date 객체)
 * @param location - 일정 이벤트 장소
 * @param hasNotice - 공지사항 연동 여부
 * @param postId - 연동된 공지사항 게시물 ID
 * @param isAdmin - 관리자 여부
 * @param postId - 연동된 공지사항 게시물 ID
 * @param isAdmin - 관리자 여부
 * @param onClickCard - 카드 전체 클릭 시 호출되는 콜백 함수 (공지사항 바로가기)
 * @param onDeleteSchedule - 일정 삭제 클릭 시 호출되는 콜백 함수 (공지사항 작성 시 삭제하는 콜백 함수)
 * @param mode - 이벤트 카드 모드 (EventCardType: 'reservation', 'calendar' 중 하나)
 */
export type EventCardProps = {
  id: number | string;
  category: ActivityCategory;
  scheduleId?: string | number;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  location?: string;
  hasNotice?: boolean;
  postId?: number;
  isAdmin?: boolean;
  onClickCard?: () => void;
  onDeleteSchedule?: () => void;
  mode?: EventCardType;
};

export function EventCard({
  id,
  category,
  scheduleId,
  title,
  startDate,
  endDate,
  location,
  isAdmin,
  hasNotice = false,
  onClickCard,
  onDeleteSchedule,
  mode,
  postId,
}: EventCardProps) {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const handleCardClick = () => {
    if (mode === 'calendar') {
      onClickCard?.();

      if (process.env.NODE_ENV === 'development') {
        console.log('EventCard clicked');
      }
    }
  };

  const handleDeleteSchedule = () => {
    onDeleteSchedule?.();

    if (process.env.NODE_ENV === 'development') {
      console.log('Delete schedule clicked');
    }
  };

  // 캘린더 화면에서 공지사항 바로가기 노출 여부
  const showNoticeLink = mode === 'calendar' && hasNotice && postId !== undefined;

  const formattedStartDate = startDate
    ? format(startDate, 'MM월 dd일 (eee) HH:mm', { locale: ko })
    : '미정';
  const formattedEndDate = endDate
    ? format(endDate, 'MM월 dd일 (eee) HH:mm', { locale: ko })
    : '미정';

  return (
    <>
      <div
        key={id}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
        className="rounded-4 border-border-border-quinary bg-background-background-normal-lighter flex w-full flex-1 cursor-pointer flex-col items-start gap-8 border px-13 py-11"
      >
        {/* Header 영역 */}
        <section className="flex items-center gap-8 self-stretch">
          <div className="flex flex-1 flex-row items-center gap-10">
            <CalendarBadge variation={category} />

            {showNoticeLink && (
              <div className="flex h-[1.18rem] cursor-pointer flex-row items-center gap-3">
                <span className="text-caption-caption5 text-foreground-foreground-tertiary">
                  공지사항 바로가기
                </span>
                <div className="relative flex items-center justify-center">
                  <SurfIcon
                    size="s"
                    name="ChevronRight"
                    className="text-foreground-foreground-tertiary"
                  />
                  {/* 클릭 범위 확장용 */}
                  <span className="absolute -inset-4" />
                </div>
              </div>
            )}
          </div>

          {/* 닫기 또는 더보기 */}
          <div className="flex items-center justify-center">
            {/* 케이스 1: 일정 작성/수정 모드일 때 닫기 버튼 */}
            {mode === 'reservation' && isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSchedule();
                }}
                className="relative flex items-center justify-center"
              >
                <SurfIcon size="m" name="X" className="text-foreground-foreground-normal-lighter" />
                <span className="absolute -inset-4" />
              </button>
            )}

            {/* 케이스 2: 일정 화면이고 운영진일 때 더보기 버튼 */}
            {mode === 'calendar' && isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActionSheetOpen(true);
                }}
                className="relative flex items-center justify-center"
              >
                <SurfIcon size="m" name="Dots" className="text-foreground-foreground-normal" />
                <span className="absolute -inset-4" />
              </button>
            )}
          </div>
        </section>

        {/* Container 영역 */}
        <section className="flex w-full flex-1 flex-col items-start self-stretch">
          {/* 일정 제목 */}
          <div className="text-body-body3 text-foreground-foreground-normal">{title}</div>

          <div className="flex flex-col items-start pt-5">
            {/* 날짜 */}
            <div className="text-body-body8 text-foreground-foreground-normal-lighter flex items-center gap-5">
              <div>{formattedStartDate}</div>
              <div>~</div>
              <div>{formattedEndDate}</div>
            </div>

            {/* 장소 */}
            <div className="text-caption-caption2 text-foreground-foreground-normal-lighter mt-3 flex items-center gap-5">
              <div>장소 :</div>
              <div>{location ? location : '미정'}</div>
            </div>
          </div>
        </section>
      </div>

      {/* 일정 액션 바텀 시트 */}
      {scheduleId && (
        <ScheduleActionSheet
          scheduleId={scheduleId}
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
          onDeleteSuccess={() => {
            onDeleteSchedule?.();
          }}
        />
      )}
    </>
  );
}
