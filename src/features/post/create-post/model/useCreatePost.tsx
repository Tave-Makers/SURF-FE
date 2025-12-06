import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/createPost';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { categoryIdToKey } from '@/entities/post/model/category';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (_data, variables) => {
      // 게시판 목록 invalidate
      const categoryKey = categoryIdToKey(variables.categoryId);
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.boardPosts(variables.boardId, categoryKey),
      });
      // 내 게시글 목록 invalidate
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.myPosts(),
      });
    },
  });
}
