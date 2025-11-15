'use client';

import { useQuery } from '@tanstack/react-query';
import { getCalendarSchedule } from '@/features/calendar/api/getCalendarSchedule';
import { ActivityMap } from '@/entities/calendar/model/types';

// 카테고리 매핑 헬퍼 함수
const mapCategoryToType = (category: string): 'official' | 'operation' | 'other' => {
  if (category === '정규행사') return 'official';
  if (category === '운영') return 'operation';
  return 'other';
};

export const useCalendarSchedule = (year: number, month: number) => {
  return useQuery({
    queryKey: ['calendar-schedule', year, month],
    queryFn: () => getCalendarSchedule({ year, month }),
    select: (data) => {
      const activityMap: ActivityMap = {};

      data.scheduleResDTOList.forEach((item) => {
        // 날짜 키 생성 (예: "2025-11-15")
        const dateKey = item.startAt.split('T')[0];

        if (!activityMap[dateKey]) {
          activityMap[dateKey] = [];
        }

        activityMap[dateKey].push({
          id: String(item.scheduleId),
          title: item.title,
          type: mapCategoryToType(item.category),
          startDate: new Date(item.startAt),
          endDate: new Date(item.endAt),
          place: item.location,
        });
      });

      return activityMap;
    },
    // staleTime: 1000 * 60,
  });
};
