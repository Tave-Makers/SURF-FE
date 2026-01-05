'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '@/entities/post/api/postApi';
import { PostListApiResponse } from '@/entities/post/api/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

/** 내가 작성한 게시글 단일 페이지 조회 */
export const useMyPosts = (page: number = 0, size: number = 20, sort: string = '') => {
  return useQuery<PostListApiResponse>({
    queryKey: postQueryKeys.myPostsPaging(page, size, sort),
    queryFn: () => postApi.getMyPosts({ page, size, sort }),
  });
};

/** 내가 작성한 게시글 무한 스크롤 조회 */
export const useInfiniteMyPosts = (size: number = 20, sort: string = '') => {
  return useInfiniteQuery<PostListApiResponse>({
    queryKey: postQueryKeys.myPostsInfinite(size, sort),
    queryFn: ({ pageParam = 0 }) => {
      const page = pageParam as number;
      return postApi.getMyPosts({ page, size, sort });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last || lastPage.empty || lastPage.numberOfElements === 0) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
