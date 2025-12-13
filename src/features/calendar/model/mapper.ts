import { format, eachDayOfInterval, isValid } from 'date-fns';
import { scheduleResDTO } from '../api/types';
import { ActivityCategory } from '@/entities/calendar/model/types';
import { ActivityMap } from '@/entities/calendar/model/types';
import { EventCardProps } from '@/entities/calendar/ui/EventCard/EventCard';

/**
 * 서버에서 내려주는 카테고리 문자열을 UI에서 사용하는 ActivityCategory로 변환
 */
const mapCategoryToActivityCategory = (category: string): ActivityCategory => {
  switch (category) {
    case '정규행사':
      return 'official';
    case '운영회의':
      return 'operation';
    case '기타일정':
      return 'other';
    default:
      return 'official';
  }
};

/**
 * 단일 DTO를 UI에서 사용하는 일정 객체로 변환
 */
const mapDTOToEvent = (dto: scheduleResDTO): EventCardProps => {
  return {
    scheduleId: dto.scheduleId,
    title: dto.title,
    category: mapCategoryToActivityCategory(dto.category),
    startDate: new Date(dto.startAt),
    endDate: new Date(dto.endAt),
    location: dto.location,
    hasNotice: dto.mappedByPost,
    postId: dto.postId,
  };
};

/**
 * API 응답 리스트를 날짜별(Key)로 그룹화된 ActivityMap으로 변환
 * @param dtoList - 서버에서 받은 일정 리스트
 * @returns {'2024-11-20': [Event1, Event2], ...} 형태의 맵
 */
export const mapScheduleListToScheduleMap = (dtoList: scheduleResDTO[]): ActivityMap => {
  const activityMap: ActivityMap = {};

  dtoList.forEach((dto) => {
    const event = mapDTOToEvent(dto);

    if (!isValid(event.startDate) || !isValid(event.endDate)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[mapScheduleListToScheduleMap] 유효하지 않은 날짜가 포함된 dto', dto);
      }
      return;
    }

    try {
      const intervalDates = eachDayOfInterval({
        start: event.startDate!,
        end: event.endDate!,
      });

      intervalDates.forEach((date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        if (!activityMap[dateKey]) {
          activityMap[dateKey] = [];
        }
        activityMap[dateKey].push({
          ...event,
          id: event.scheduleId as number,
        });
      });
    } catch (error) {
      console.error(error);
    }
  });

  return activityMap;
};
