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
  // TODO(BE): categoryId 파라미터 추가 요청 중. 추가되면 여기로 받아 서버 필터링으로 전환
  // (현재는 SearchPostListContainer에서 클라이언트 필터링)
  size?: number;
};

export function useInfiniteSearchPosts({ param, boardId, size = 10 }: SearchPostsParams) {
  return useInfiniteQuery({
    queryKey: ['search-posts', param, boardId, size],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<CommonResponse<PageData>>('/v1/user/search/posts', {
        params: { param, page: pageParam, size, ...(boardId !== undefined && { boardId }) },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: !!param && param.trim().length > 0,
  });
}
