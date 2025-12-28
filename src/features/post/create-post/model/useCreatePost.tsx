import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/createPost';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      /* --------------------
       * 1. 게시글 목록 invalidate
       * -------------------- */
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });

      /* --------------------
       * 2. 내 게시글 목록 invalidate
       * -------------------- */
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.myPosts ? postQueryKeys.myPosts() : postQueryKeys.lists(),
      });
    },
  });
}
