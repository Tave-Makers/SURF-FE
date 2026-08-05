import { useQuery } from '@tanstack/react-query';

import { postDetailQueryOptions } from '@/entities/post/api/queryOptions';
import { transformDetailToPost } from '@/entities/post/model/mappers';

export const usePostDetail = (postId: number, options?: { enabled?: boolean }) =>
  useQuery({
    ...postDetailQueryOptions(postId),
    enabled: options?.enabled ?? true,
    select: transformDetailToPost,
  });
