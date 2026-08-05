'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { PostListItemResponse } from '@/entities/post/api/types';
import type { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

type PageData = {
  content: PostListItemResponse[];
  number: number;
  size: number;
  last: boolean;
};

export function useInfiniteSearchPosts(param: string, size = 10) {
  return useInfiniteQuery({
    queryKey: ['search-posts', param, size],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<CommonResponse<PageData>>('/v1/user/search/posts', {
        params: { param, page: pageParam, size },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: !!param && param.trim().length > 0,
  });
}
