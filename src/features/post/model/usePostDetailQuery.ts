import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../api/getPostDetail';
import { transformDetailToPost } from '@/entities/post/model/mappers';
import { PostDetail } from '@/entities/post/model/types';

/**
 * 게시글 상세 조회 React Query 훅
 */
export const usePostDetail = (postId: number, options?: { enabled?: boolean }) =>
  useQuery<PostDetail>({
    queryKey: ['postDetail', postId],
    queryFn: async () => {
      const detail = await getPostDetail(postId);
      return transformDetailToPost(detail);
    },
    enabled: options?.enabled ?? postId != null,
  });
