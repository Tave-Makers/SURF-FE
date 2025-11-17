import { useMutation } from '@tanstack/react-query';
import { toggleLike } from '../api/toggleLike';

export const useToggleLikeMutation = () => {
  return useMutation({
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      toggleLike(postId, liked),
  });
};
