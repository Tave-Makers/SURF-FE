import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostSchedule } from '../api/createPostSchedule';
import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

interface CreateScheduleVariables {
  postId: number;
  data: ScheduleCreateRequest;
}

export const useCreatePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleCreateResponse, Error, CreateScheduleVariables>({
    mutationKey: ['schedule', 'create', 'post'],
    mutationFn: ({ postId, data }) => createPostSchedule(postId, data),

    onSuccess: () => {
      // 1) 단건 일정들
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.details(),
      });

      // 2) 일정 목록 (캘린더)
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.lists(),
      });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('게시글 작성 시 일정 생성 요청 실패:', error);
      }
    },
  });
};
