'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PostCardList } from '@/widgets/post-list/ui/PostCardList';
import { useInfiniteBoardPosts } from '@/entities/post/api/useInfiniteBoardPosts';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { transformListItemToPost } from '@/entities/post/model/mappers';
import type { UserLevel } from '@/entities/user/model/types';
import type { Post } from '@/entities/post/model/types';
import type { TabCategoryKey } from '@/entities/post/model/tab';
import { TAB_CATEGORIES } from '@/entities/post/model/tab';

type Props = {
  boardId: number;
  category: TabCategoryKey;
  userLevel: UserLevel;
};

export const PostListContainer = ({ boardId, category, userLevel }: Props) => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteBoardPosts({ boardId, category });

  const loadMoreRef = useInfiniteScroll({
    enabled: true,
    hasNextPage,
    onLoadMore: () => void fetchNextPage(),
    isFetching: isFetchingNextPage,
  });

  const posts = data?.pages.flatMap((page) => page.content.map(transformListItemToPost)) ?? [];

  const tabCategoryLabel = TAB_CATEGORIES[category].label;

  const showCategoryBadge = tabCategoryLabel === '전체';
  const showReservationBadge = userLevel !== 'member';

  const handlePostCardClick = useCallback(
    (post: Post) => {
      router.push(`/board/${boardId}/post/${post.postId}`);
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
        shouldShowCategoryBadge={showCategoryBadge}
        shouldShowReservationBadge={showReservationBadge}
        error={error}
      />
    </div>
  );
};
