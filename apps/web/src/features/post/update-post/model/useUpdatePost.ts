import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePostRequest } from '../api/types';
import { updatePost } from '../api/updatePost';
import { transformDetailToPost } from '@/entities/post/model/mappers';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { categoryIdToKey } from '@/entities/post/model/category';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => updatePost(postId, data),

    onSuccess: (updatedRes) => {
      const mappedRes = transformDetailToPost(updatedRes);

      /* --------------------
       * 1. 게시글 상세 캐시 직접 업데이트
       * -------------------- */
      queryClient.setQueryData(postQueryKeys.detail(postId), mappedRes);

      /* --------------------
       * 2. 게시판 목록 invalidate
       * -------------------- */
      const categoryKey = categoryIdToKey(mappedRes.categoryId);

      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.boardPosts
          ? postQueryKeys.boardPosts(mappedRes.boardId, categoryKey)
          : postQueryKeys.lists(), // 구조 이행 중 안전장치
      });

      /* --------------------
       * 3. 내 게시글 목록 invalidate
       * -------------------- */
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.myPosts ? postQueryKeys.myPosts() : postQueryKeys.lists(),
      });

      /* --------------------
       * 4. 일정이 연결된 게시글이면 schedule 캐시 invalidate
       * -------------------- */
      if (mappedRes.scheduleId) {
        void queryClient.invalidateQueries({
          queryKey: scheduleQueryKeys.detail(mappedRes.scheduleId),
        });

        void queryClient.invalidateQueries({
          queryKey: scheduleQueryKeys.lists(),
        });
      }
    },
  });
};
