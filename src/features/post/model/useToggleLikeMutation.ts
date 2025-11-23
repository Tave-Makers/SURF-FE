import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/toggleLike';

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      toggleLike(postId, liked),
    onSuccess: (_, variables) => {
      // 게시글 상세 캐시 무효화
      void queryClient.invalidateQueries({
        queryKey: ['postDetail', variables.postId],
      });
    },
  });
};
