'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { transformListItemToPost } from '@/entities/post/model/mappers';
import type { PostListItemResponse } from '@/entities/post/api/types';
import { PostCardList } from '@/widgets/post-list/ui/PostCardList';
import { Post } from '@/entities/post/model/types';
import type { UserLevel } from '@/entities/user/model/types';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';

// 서버 응답 data 페이지 당 타입
type ApiPage = {
  content: PostListItemResponse[];
};

// 무한 스크롤 훅 응답 타입
type UseInfinitePostsQueryResult = UseInfiniteQueryResult<InfiniteData<ApiPage>, Error>;

type PostListPageProps = {
  useInfiniteQueryHook: (size: number, sort: string) => UseInfinitePostsQueryResult;
  onPostClick?: (post: Post) => void;
  scrollRootRef?: React.RefObject<HTMLDivElement | null>;
  // 추후 MVP에서 단일 페이지 조회 훅도 추가 될 수 있음
  userLevel: UserLevel;
};

export function PostListPage({
  useInfiniteQueryHook,
  onPostClick,
  scrollRootRef,
  userLevel,
}: PostListPageProps) {
  const router = useRouter();

  // 화면 하단 DOM 요소 참조
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const size = 20;
  const sort: string = ''; // 추후 정렬 기능 구현 시 동적으로 변경

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQueryHook(size, sort);

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allPosts =
    data?.pages.flatMap((page) => page.content.map((item) => transformListItemToPost(item))) ?? [];

  // IntersectionObserver로 sentinel 감시
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // sentinel 요소가 화면에 보이면 다음 페이지를 불러오기
        if (entries[0].isIntersecting) {
          fetchNextPage().catch((err) => {
            console.error('fetchNextPage error:', err);
          });
        }
      },
      { root: scrollRootRef?.current ?? null, rootMargin: '0px 0px 200px 0px' },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, scrollRootRef]);

  const handlePostClick = useCallback(
    (post: Post) => {
      onPostClick?.(post);
      router.push(PAGE_ROUTES.BOARD.POST_DETAIL(post.boardId, post.postId));
    },
    [onPostClick, router],
  );

  // 에러 처리 화면
  if (error) {
    return (
      <div>
        <div>에러가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 에러'}</div>
        <div>
          {error instanceof Error && error.message.includes('403')
            ? '인증이 필요합니다. 다시 로그인해주세요.'
            : '잠시 후 다시 시도해주세요.'}
        </div>
      </div>
    );
  }

  // 게시글 목록 렌더링
  return (
    <PostCardList
      posts={allPosts}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onPostClick={handlePostClick}
      loadMoreRef={loadMoreRef}
      shouldShowCategoryBadge={false}
      shouldShowReservationBadge={false}
      userLevel={userLevel}
    />
  );
}
