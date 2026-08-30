'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { categoryKeyToId } from '@/entities/post/model/category';
import { transformListItemToPost } from '@/entities/post/model/mappers';
import { BOARD_TAB_MAP } from '@/entities/post/model/tab';
import type { Post } from '@/entities/post/model/types';
import type { UserLevel } from '@/entities/user/model/types';
import { useInfiniteSearchPosts } from '@/features/post/search-post/api/useInfiniteSearchPosts';
import { PAGE_ROUTES } from '@/shared/config/path';
import { PostCardList } from '@/widgets/post-list/ui/PostCardList';

type Props = {
  keyword: string;
  boardId: number;
  category: string;
  userLevel: UserLevel;
};

const SearchPostListContainer = ({ keyword, boardId, category, userLevel }: Props) => {
  const router = useRouter();

  const categoryId = category === 'all' ? undefined : categoryKeyToId(category, boardId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteSearchPosts({ param: keyword, boardId, categoryId });

  const loadMoreRef = useInfiniteScroll({
    enabled: true,
    hasNextPage,
    onLoadMore: () => void fetchNextPage(),
    isFetching: isFetchingNextPage,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.content.map(transformListItemToPost)) ?? [],
    [data?.pages],
  );

  const tabCategoryLabel =
    BOARD_TAB_MAP[boardId]?.find((t) => t.value === category)?.label ?? '전체';

  const handlePostCardClick = useCallback(
    (post: Post) => {
      router.push(PAGE_ROUTES.BOARD.POST_DETAIL(post.boardId ?? boardId, post.postId));
    },
    [router, boardId],
  );

  return (
    <div className="flex flex-1 flex-col">
      <PostCardList
        posts={posts}
        currentTabCategory={tabCategoryLabel}
        userLevel={userLevel}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        loadMoreRef={loadMoreRef}
        onPostClick={handlePostCardClick}
        shouldShowCategoryBadge={false}
        shouldShowReservationBadge={false}
        error={error}
      />
    </div>
  );
};

export { SearchPostListContainer };
