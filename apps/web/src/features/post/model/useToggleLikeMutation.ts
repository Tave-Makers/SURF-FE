import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/toggleLike';
import { PostDetail } from '@/entities/post/model/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { PostListApiResponse } from '@/entities/post/api/types';

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...postQueryKeys.all, 'toggleLike'],
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      toggleLike(postId, liked),

    onMutate: async ({ postId, liked }) => {
      const detailKey = postQueryKeys.detail(postId);
      const listKey = postQueryKeys.lists();

      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: listKey });

      const prevDetail = queryClient.getQueryData<PostDetail>(detailKey);
      const prevLists = queryClient.getQueriesData({ queryKey: listKey });

      // 1. 상세 페이지 캐시 업데이트
      queryClient.setQueryData<PostDetail>(detailKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          likedByMe: !liked,
          likeCount: liked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      // 2. 목록 캐시 업데이트
      queryClient.setQueriesData<InfiniteData<PostListApiResponse> | PostListApiResponse>(
        { queryKey: listKey },
        (old) => {
          if (!old) return old;

          // 무한 스크롤 데이터 구조인 경우 (InfiniteData)
          if ('pages' in old) {
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                content: page.content.map((post) =>
                  post.postId === postId
                    ? {
                        ...post,
                        likedByMe: !liked,
                        likeCount: liked ? post.likeCount - 1 : post.likeCount + 1,
                      }
                    : post,
                ),
              })),
            };
          }

          // 일반 페이징 데이터 구조인 경우 (PostListApiResponse)
          if ('content' in old) {
            return {
              ...old,
              content: old.content.map((post) =>
                post.postId === postId
                  ? {
                      ...post,
                      likedByMe: !liked,
                      likeCount: liked ? post.likeCount - 1 : post.likeCount + 1,
                    }
                  : post,
              ),
            };
          }

          return old;
        },
      );

      return { prevDetail, prevLists };
    },

    // 실패 시 롤백
    onError: (_err, variables, context) => {
      // 상세 데이터 롤백
      if (context?.prevDetail) {
        queryClient.setQueryData(postQueryKeys.detail(variables.postId), context.prevDetail);
      }
      // 목록 데이터들 롤백 (getQueriesData로 백업한 모든 리스트 복구)
      if (context?.prevLists) {
        context.prevLists.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: (_data, _error, variables) => {
      const postId = variables.postId;

      // 게시글 상세 무효화
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(postId),
      });
    },
  });
};
