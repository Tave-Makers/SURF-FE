import { useQuery } from '@tanstack/react-query';

import { transformDetailToPost } from '@/entities/post/model/mappers';
import { postDetailQueryOptions } from '@/entities/post/api/queryOptions';

export const usePostDetail = (postId: number, options?: { enabled?: boolean }) =>
  useQuery({
    ...postDetailQueryOptions(postId),
    enabled: options?.enabled ?? true,
    select: transformDetailToPost,
  });
