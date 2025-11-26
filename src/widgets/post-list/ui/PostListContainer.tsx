'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PostList } from '@/widgets/post-list/ui/PostCardList';
import { useInfiniteBoardPosts } from '@/entities/post/api/useInfiniteBoardPosts';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { transformListItemToPost, categoryIdToLabel } from '@/entities/post/model/mappers';
import type { UserLevel } from '@/entities/user/model/types';
import type { Post } from '@/entities/post/model/types';

type Props = {
  boardId: number;
  category: string;
  userLevel: UserLevel;
};

export const PostListContainer = ({ boardId, category, userLevel }: Props) => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteBoardPosts(
    { boardId, category },
  );

  const loadMoreRef = useInfiniteScroll({
    enabled: true,
    hasNextPage,
    onLoadMore: () => void fetchNextPage(),
  });

  const posts = data?.pages.flatMap((page) => page.content.map(transformListItemToPost)) ?? [];

  const categoryLabel = categoryIdToLabel(category);
  const showCategoryBadge = categoryLabel === '전체';
  const showReservationBadge = userLevel !== 'member';

  const handlePostCardClick = useCallback(
    (post: Post) => {
      router.push(`/post/${post.postId}`);
    },
    [router],
  );

  return (
    <div className="flex flex-1 flex-col">
      <PostList
        posts={posts}
        currentCategory={categoryLabel}
        userLevel={userLevel}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        loadMoreRef={loadMoreRef}
        onPostClick={handlePostCardClick}
        shouldShowCategoryBadge={showCategoryBadge}
        shouldShowReservationBadge={showReservationBadge}
      />
    </div>
  );
};
