import { useCallback } from 'react';
import { stripHtml } from '@/shared/lib/stripHtml';
import { isSameSchedule } from '@/features/schedule/lib/scheduleUtils';
import { EditorState, PostSnapshot } from '@/features/post/post-form/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';

type Props = {
  title: string;
  category: string;
  editorStateRef: React.MutableRefObject<EditorState>;
  linkedSchedule: ScheduleFormData | null;
  reserved: boolean;
  reservedAt: Date | null;
  initialSnapshot: React.MutableRefObject<
    PostSnapshot & { initialSchedule: ScheduleFormData | null }
  >;
};

export const usePostDirtyCheck = ({
  title,
  category,
  editorStateRef,
  linkedSchedule,
  reserved,
  reservedAt,
  initialSnapshot,
}: Props) => {
  const checkHasChanges = useCallback(() => {
    const init = initialSnapshot.current;

    // 현재 상태 구성
    const current = {
      title,
      category,
      content: editorStateRef.current.content,
      imageUrls: editorStateRef.current.images.map((img) => img.uploadedUrl ?? null),
      reserved,
      reservedAt,
    };

    // 1. 기본 필드 비교
    const isTitleChanged = current.title !== init.title;
    const isCategoryChanged = current.category !== init.category;
    const isContentChanged = current.content !== init.content;
    const isImagesChanged = JSON.stringify(current.imageUrls) !== JSON.stringify(init.imageUrls);

    // 2. 예약 정보 비교
    const isReservedToggleChanged = current.reserved !== init.reserved;
    const currentTime = current.reservedAt?.getTime() ?? null;
    const initTime = init.reservedAt?.getTime() ?? null;
    const isReservationChanged = isReservedToggleChanged || currentTime !== initTime;

    // 3. 일정 정보 비교 (유틸 함수 사용)
    let isScheduleChanged = false;
    const initialSchedule = init.initialSchedule;

    if (!linkedSchedule && !initialSchedule) {
      isScheduleChanged = false;
    } else if (!linkedSchedule || !initialSchedule) {
      isScheduleChanged = true;
    } else {
      isScheduleChanged = !isSameSchedule(linkedSchedule, initialSchedule);
    }

    const isEmpty =
      !current.title && stripHtml(current.content) === '' && current.imageUrls.length === 0;

    return {
      hasChanges:
        isTitleChanged ||
        isCategoryChanged ||
        isContentChanged ||
        isImagesChanged ||
        isReservationChanged ||
        isScheduleChanged,
      isImagesChanged,
      isReservationChanged,
      isEmpty,
    };
  }, [title, category, reserved, reservedAt, linkedSchedule, editorStateRef, initialSnapshot]);

  return { checkHasChanges };
};
