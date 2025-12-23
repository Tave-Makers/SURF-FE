import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostSchedule } from '../api/createPostSchedule';
import { scheduleQueryKeys } from '@/entities/schedule/api/queryKeys';

interface CreateScheduleVariables {
  postId: number;
  data: ScheduleCreateRequest;
}

export const useCreatePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleCreateResponse, Error, CreateScheduleVariables>({
    mutationKey: ['schedule', 'create'],
    mutationFn: ({ postId, data }) => createPostSchedule(postId, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('게시글 작성 시 일정 생성 요청 실패:', error);
      }
    },
  });
};
