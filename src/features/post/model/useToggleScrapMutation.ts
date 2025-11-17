import { useMutation } from '@tanstack/react-query';
import { toggleScrap } from '../api/toggleScrap';

export const useToggleScrapMutation = () => {
  return useMutation({
    mutationFn: ({ postId, scrapped }: { postId: number; scrapped: boolean }) =>
      toggleScrap(postId, scrapped),
  });
};
