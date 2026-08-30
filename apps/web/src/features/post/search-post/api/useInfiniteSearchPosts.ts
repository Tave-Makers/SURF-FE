'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommonResponse } from '@/shared/api/types';
import { PostListItemResponse } from '@/entities/post/api/types';

type PageData = {
  content: PostListItemResponse[];
  number: number;
  size: number;
  last: boolean;
};

type SearchPostsParams = {
  param: string;
  // 지정하면 해당 게시판 내에서만 검색, 미지정 시 통합 검색
  boardId?: number;
  // 지정하면 해당 카테고리 내에서만 검색. 카테고리는 게시판에 속하므로 boardId보다 우선한다
  categoryId?: number;
  size?: number;
};

export function useInfiniteSearchPosts({
  param,
  boardId,
  categoryId,
  size = 10,
}: SearchPostsParams) {
  return useInfiniteQuery({
    queryKey: ['search-posts', param, boardId, categoryId, size],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<CommonResponse<PageData>>('/v1/user/search/posts', {
        params: {
          param,
          page: pageParam,
          size,
          ...(boardId !== undefined && { boardId }),
          ...(categoryId !== undefined && { categoryId }),
        },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: !!param && param.trim().length > 0,
  });
}
