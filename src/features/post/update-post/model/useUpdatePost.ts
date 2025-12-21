import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePostRequest } from '../api/type';
import { updatePost } from '../api/updatePost';
import { transformDetailToPost } from '@/entities/post/model/mappers';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { categoryIdToKey } from '@/entities/post/model/category';

export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => updatePost(postId, data),
    onSuccess: (updatedRes) => {
      const mappedRes = transformDetailToPost(updatedRes);
      // 상세 페이지 캐시 업데이트
      queryClient.setQueryData(postQueryKeys.postDetail(postId), mappedRes);

      // 게시판 목록 invalidate
      const categoryKey = categoryIdToKey(mappedRes.categoryId);

      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.boardPosts(mappedRes.boardId, categoryKey),
      });

      // 게시글 상세 조회 invalidate
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.postDetail(postId),
      });

      // 내 게시글 목록 invalidate
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.myPosts(),
      });
    },
  });
};
