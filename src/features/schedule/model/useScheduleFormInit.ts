import { useMemo } from 'react';
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
  const { linkedSchedule } = useCreatePostScheduleStore();

  // 1. 서버 데이터 Fetch 여부 (캘린더 수정 OR 게시글 수정 초기 진입)
  const shouldFetch =
    !!scheduleId &&
    ((entryPoint === 'calendar' && calendarMode === 'edit') ||
      (entryPoint === 'post' && postMode === 'edit' && !linkedSchedule));

  const { data: serverData, isLoading } = useGetSingleSchedule(scheduleId || 0, {
    enabled: shouldFetch,
  });

  // 2. 초기 데이터 결정 (Zustand > Server > null)
  const initialData = useMemo(() => {
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
  }, [entryPoint, linkedSchedule, serverData]);

  return { initialData, isLoading };
};
