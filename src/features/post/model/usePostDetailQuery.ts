import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../api/getPostDetail';
import { getPostSchedule } from '../api/getPostSchedule';
import { transformDetailToPost } from '@/entities/post/model/mappers';
import { PostDetail } from '@/entities/post/model/types';

/**
 * 게시글 상세 조회 (일정 포함)
 */
export const usePostDetail = (postId: number) =>
  useQuery<PostDetail>({
    queryKey: ['postDetail', postId],
    queryFn: async () => {
      // 1) 상세 조회
      const detail = await getPostDetail(postId);

      // 2) 일정 조회 필요 여부 확인
      const schedule = detail.hasSchedule ? await getPostSchedule(postId) : null;

      // 3) UI용 데이터 구조로 변환 + 해당 게시글의 일정
      return transformDetailToPost({
        ...detail,
        schedule,
      });
    },
    enabled: postId != null,
  });
