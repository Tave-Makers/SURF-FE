import { useCallback } from 'react';
import { stripHtml } from '@/shared/lib/stripHtml';
import { isSameSchedule } from '@/features/schedule/lib/scheduleUtils';
import { usePostFormStore } from './usePostFormStore';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';

export const usePostDirtyCheck = () => {
  const { title, category, content, images, initialSnapshot, reserved, reservedAt } =
    usePostFormStore();
  const { linkedSchedule } = useCreatePostScheduleStore();

  const checkHasChanges = useCallback(() => {
    if (!initialSnapshot) {
      // 스냅샷이 없으면 현재 폼 상태로 isEmpty 판단
      console.log('title: ', title);
      console.log('content: ', content);
      const isEmpty = !title.trim() && stripHtml(content).trim() === '' && images.length === 0;
      return { hasChanges: false, isEmpty };
    }

    // 현재 이미지 URL 리스트 가공 (uploadedUrl만 추출)
    const currentImageUrls = images.map((img) => img.uploadedUrl ?? null);

    // 1. 기본 필드 비교
    const isTitleChanged = title !== initialSnapshot.title;
    const isCategoryChanged = category !== initialSnapshot.category;
    const isContentChanged = content !== initialSnapshot.content;
    const isImagesChanged =
      JSON.stringify(currentImageUrls) !== JSON.stringify(initialSnapshot.imageUrls);

    // 2. 예약 정보 비교
    const isReservedToggleChanged = reserved !== initialSnapshot.reserved;
    const currentTime = reservedAt?.getTime() ?? null;
    const initTime = initialSnapshot.reservedAt?.getTime() ?? null;
    const isReservationChanged = isReservedToggleChanged || currentTime !== initTime;

    // 3. 일정 정보 비교 (유틸 함수 사용)
    let isScheduleChanged = false;
    const initialSchedule = initialSnapshot.initialSchedule;

    if (!linkedSchedule && !initialSchedule) {
      isScheduleChanged = false;
    } else if (!linkedSchedule || !initialSchedule) {
      isScheduleChanged = true;
    } else {
      isScheduleChanged = !isSameSchedule(linkedSchedule, initialSchedule);
    }

    const isEmpty = !title.trim() && stripHtml(content).trim() === '' && images.length === 0;

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
      isScheduleChanged,
      isEmpty,
    };
  }, [title, category, content, images, linkedSchedule, reserved, reservedAt, initialSnapshot]);

  return { checkHasChanges };
};
