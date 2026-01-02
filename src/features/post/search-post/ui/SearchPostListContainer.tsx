'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PostCardList } from '@/widgets/post-list/ui/PostCardList';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { transformListItemToPost } from '@/entities/post/model/mappers';
import type { UserLevel } from '@/entities/user/model/types';
import type { Post } from '@/entities/post/model/types';
import type { TabCategoryKey } from '@/entities/post/model/tab';
import { TAB_CATEGORIES } from '@/entities/post/model/tab';
import { POST_CATEGORIES } from '@/entities/post/model/category';
import { useInfiniteSearchPosts } from '@/features/post/search-post/api/useInfiniteSearchPosts';
import type { PostListItemResponse } from '@/entities/post/api/types';

type Props = {
  keyword: string;
  category: TabCategoryKey;
  userLevel: UserLevel;
};

function categoryKeyToId(category: TabCategoryKey): number | null {
  if (category === 'all') return null;
  return POST_CATEGORIES[category as keyof typeof POST_CATEGORIES]?.id ?? null;
}

const SearchPostListContainer = ({ keyword, category, userLevel }: Props) => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteSearchPosts(keyword, 10);

  const loadMoreRef = useInfiniteScroll({
    enabled: true,
    hasNextPage,
    onLoadMore: () => void fetchNextPage(),
    isFetching: isFetchingNextPage,
  });

  const filteredItems = useMemo(() => {
    const allItems: PostListItemResponse[] = data?.pages.flatMap((p) => p.content) ?? [];
    const id = categoryKeyToId(category);
    if (id == null) return allItems;
    return allItems.filter((x) => x.categoryId === id);
  }, [data?.pages, category]);

  const posts = useMemo(() => filteredItems.map(transformListItemToPost), [filteredItems]);

  const tabCategoryLabel = TAB_CATEGORIES[category].label;

  const handlePostCardClick = useCallback(
    (post: Post) => {
      const boardId = post.boardId ?? 1;
      router.push(`/board/${boardId}/post/${post.postId}`);
    },
    [router],
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
