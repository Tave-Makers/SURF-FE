import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePostRequest } from '../api/type';
import { updatePost } from '../api/updatePost';

export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => updatePost(postId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['postDetail', postId],
      });
    },
  });
};
