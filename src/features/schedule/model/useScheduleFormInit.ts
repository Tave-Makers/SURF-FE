import { useMemo, useState, useEffect } from 'react';
import { useCreatePostScheduleStore } from '../create-post-schedule/model/useCreatePostScheduleStore';
import { useGetSingleSchedule } from '../edit/model/useGetSingleSchedule';
import { ScheduleFormData } from '../create/model/types';
import { CATEGORY_MAP } from '@/entities/schedule/model/constants';

type InitProps = {
  entryPoint: 'calendar' | 'post';
  postMode?: 'create' | 'edit';
  calendarMode?: 'create' | 'edit';
  scheduleId?: number;
};

export const useScheduleFormInit = ({
  entryPoint,
  postMode,
  calendarMode,
  scheduleId,
}: InitProps) => {
  // 1. Zustand 데이터 복구 완료 상태 관리
  const [isHydrated, setIsHydrated] = useState(false);
  const { linkedSchedule } = useCreatePostScheduleStore();

  // 2. 컴포넌트 마운트 시점에 Hydration 완료 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 3. 서버 데이터 Fetch 여부 (캘린더 수정 OR 게시글 수정 초기 진입)
  const shouldFetch =
    !!scheduleId &&
    ((entryPoint === 'calendar' && calendarMode === 'edit') ||
      (entryPoint === 'post' && postMode === 'edit' && !linkedSchedule));

  const { data: serverData, isLoading: isServerLoading } = useGetSingleSchedule(scheduleId, {
    enabled: shouldFetch && isHydrated,
  });

  // 4. 초기 데이터 결정 (Zustand > Server > null)
  const initialData = useMemo(() => {
    if (!isHydrated) return null;

    if (entryPoint === 'post' && linkedSchedule) return linkedSchedule;

    if (serverData) {
      return {
        title: serverData.title,
        startDate: new Date(serverData.startAt),
        endDate: new Date(serverData.endAt),
        location: serverData.location ?? '',
        category: CATEGORY_MAP[serverData.category] || 'regular',
      } as ScheduleFormData;
    }
    return null;
  }, [entryPoint, linkedSchedule, serverData, isHydrated]);

  const isLoading = !isHydrated || isServerLoading;

  return { initialData, isLoading, isHydrated };
};
