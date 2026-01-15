import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePostSchedule } from '../api/delPostSchedule';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

interface DeletePostScheduleParams {
  postId: number;
  scheduleId: number;
}

export const useDeletePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['schedule', 'delete', 'post'],
    mutationFn: ({ postId, scheduleId }: DeletePostScheduleParams) =>
      deletePostSchedule(postId, scheduleId),

    onSuccess: (_data, { postId, scheduleId }) => {
      // 1. 캘린더 / 날짜별 일정 리스트
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.lists(),
      });
      // 2. 일정 단건 캐시 제거
      queryClient.removeQueries({
        queryKey: scheduleQueryKeys.detail(scheduleId),
      });
      // 3. 게시글 상세
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(postId),
      });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('게시글과 매핑된 일정 삭제 실패', error);
      }
    },
  });
};
