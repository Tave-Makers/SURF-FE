import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/toggleLike';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

type PostLikeFields = {
  likedByMe: boolean;
  likeCount: number;
};

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...postQueryKeys.all, 'toggleLike'],
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      toggleLike(postId, liked),

    onMutate: async ({ postId, liked }) => {
      const detailKey = postQueryKeys.detail(postId);
      const listKey = postQueryKeys.lists();

      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousDetail = queryClient.getQueryData<PostLikeFields>(detailKey);

      queryClient.setQueryData<PostLikeFields>(detailKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          likedByMe: !liked,
          likeCount: Math.max(0, old.likeCount + (liked ? -1 : 1)),
        };
      });

      return { previousDetail };
    },

    // 실패 시 롤백
    onError: (_err, variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(postQueryKeys.detail(variables.postId), context.previousDetail);
      }
    },
    onSettled: (_data, _error, variables) => {
      const postId = variables.postId;

      // 게시글 상세 무효화
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(postId),
      });
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });
};
