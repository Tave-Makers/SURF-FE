'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { PostListItemResponse } from '@/entities/post/api/types';
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteSearchPosts({ param: keyword, boardId });

  const loadMoreRef = useInfiniteScroll({
    enabled: true,
    hasNextPage,
    onLoadMore: () => void fetchNextPage(),
    isFetching: isFetchingNextPage,
  });

  // TODO(BE): GET /v1/user/search/posts에 categoryId 파라미터 추가 요청 필요.
  // 현재 검색 API는 boardId까지만 지원해 카테고리 탭을 서버에서 거를 수 없고,
  // 아래처럼 이미 받아온 페이지 안에서만 필터링한다 → 다음 페이지를 더 불러오기 전까지
  // 해당 카테고리 글이 실제보다 적게 보이고, 페이지네이션 카운트도 어긋난다.
  // 파라미터가 추가되면 이 useMemo를 걷어내고 useInfiniteSearchPosts로 넘긴다.
  const filteredItems = useMemo(() => {
    const allItems: PostListItemResponse[] = data?.pages.flatMap((p) => p.content) ?? [];
    const id = category === 'all' ? undefined : categoryKeyToId(category, boardId);
    if (id == null) return allItems;
    return allItems.filter((x) => x.categoryId === id);
  }, [data?.pages, category, boardId]);

  const posts = useMemo(() => filteredItems.map(transformListItemToPost), [filteredItems]);

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
