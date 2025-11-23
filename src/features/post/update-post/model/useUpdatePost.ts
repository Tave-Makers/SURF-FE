import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePostRequest } from '../api/type';
import { updatePost } from '../api/updatePost';
import { transformDetailToPost } from '@/entities/post/model/mappers';

export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => updatePost(postId, data),
    onSuccess: (updatedRes) => {
      const mappedRes = transformDetailToPost(updatedRes);
      queryClient.setQueryData(['postDetail', postId], mappedRes);
    },
  });
};
