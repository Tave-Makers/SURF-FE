import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../api/getPostDetail';
import { transformDetailToPost } from './mappers';
import { Post } from '../model/types';

/**
 * 게시글 상세 조회 React Query 훅
 */
export const usePostDetail = (postId: number) =>
  useQuery<Post>({
    queryKey: ['postDetail', postId],
    queryFn: async () => {
      const detail = await getPostDetail(postId);
      return transformDetailToPost(detail);
    },
    enabled: postId != null,
  });
