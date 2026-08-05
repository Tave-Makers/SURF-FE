import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleScrap } from '../api/toggleScrap';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { PostListApiResponse } from '@/entities/post/api/types';
import { PostDetail } from '@/entities/post/model/types';

export const useToggleScrapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...postQueryKeys.all, 'toggleScrap'],
    mutationFn: ({ postId, scrapped }: { postId: number; scrapped: boolean }) =>
      toggleScrap(postId, scrapped),

    // Optimistic update
    onMutate: async ({ postId, scrapped }) => {
      const detailKey = postQueryKeys.detail(postId);
      const listKey = postQueryKeys.lists();

      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: listKey });

      const prevDetail = queryClient.getQueryData<PostDetail>(detailKey);
      const prevLists = queryClient.getQueriesData<
        InfiniteData<PostListApiResponse> | PostListApiResponse
      >({
        queryKey: listKey,
      });

      // 1. 상세 페이지 캐시 업데이트
      queryClient.setQueryData<PostDetail>(detailKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          scrappedByMe: !scrapped,
          scrapCount: scrapped ? old.scrapCount - 1 : old.scrapCount + 1,
        };
      });

      // 2. 목록 캐시 업데이트
      queryClient.setQueriesData<InfiniteData<PostListApiResponse> | PostListApiResponse>(
        { queryKey: listKey },
        (old) => {
          if (!old) return old;

          // 무한 스크롤 구조
          if ('pages' in old) {
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                content: page.content.map((post) =>
                  post.postId === postId ? { ...post, scrappedByMe: !scrapped } : post,
                ),
              })),
            };
          }

          // 일반 페이징 구조
          if ('content' in old) {
            return {
              ...old,
              content: old.content.map((post) =>
                post.postId === postId ? { ...post, scrappedByMe: !scrapped } : post,
              ),
            };
          }

          return old;
        },
      );

      return { prevDetail, prevLists };
    },

    onError: (_err, variables, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(postQueryKeys.detail(variables.postId), context.prevDetail);
      }
      if (context?.prevLists) {
        context.prevLists.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },

    onSettled: (_data, _error, variables) => {
      // 게시글 상세 무효화
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(variables.postId) });
      // 내가 스크랩한 게시글 무효화
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.scraps() });
    },
  });
};
