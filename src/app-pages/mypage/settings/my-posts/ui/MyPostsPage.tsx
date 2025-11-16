'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { transformListItemToPost } from '@/entities/post/model/mappers';
import { PostList } from '@/widgets/post-list/ui/PostList';
import type { Post } from '@/entities/post/model/types';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { usePageName } from '@/shared/analytics/lib/getPageName';

export default function MyPostsPage() {
  const pageName = usePageName();
  const scrollRef = useDynamicScrollTracking<HTMLDivElement>((percent: number) => {
    trackMyPostsEvent(MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE, { percent });
  });

  // 화면 하단 DOM 요소 참조
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const size = 10;
  const sort = useMemo<string[]>(() => [], []);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMyPosts(size, sort);

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allPosts =
    data?.pages.flatMap((page) => page.content.map((item) => transformListItemToPost(item))) ?? [];

  // 페이지 진입 시 페이지 뷰 로그
  useEffect(() => {
    trackMyPostsEvent(MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE, { page_name: pageName });
  }, [pageName]);

  // IntersectionObserver로 sentinel 감시
  useEffect(() => {
    // 더 이상 불러올 페이지가 없으면 Observer를 설정하지 않음
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // sentinel 요소가 화면에 보이면 다음 페이지를 불러오기
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage().catch((err) => {
            console.error('fetchNextPage error:', err);
          });
        }
      },
      { root: scrollRef?.current ?? null, rootMargin: '0px 0px 200px 0px' },
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, scrollRef, hasNextPage, isFetchingNextPage]);

  const handlePostClick = useCallback((post: Post) => {
    trackMyPostsEvent(MY_POSTS_EVENTS.CLICK_POST_CARD, { post_id: String(post.postId) });
  }, []);

  // 에러 처리 화면
  if (error) {
    return (
      <div className="flex h-full">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-13">
          <div>
            <div>
              에러가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 에러'}
            </div>
            <div>
              {error instanceof Error && error.message.includes('403')
                ? '인증이 필요합니다. 다시 로그인해주세요.'
                : '잠시 후 다시 시도해주세요.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 게시글 목록 렌더링
  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <PostList
          posts={allPosts}
          currentCategory="all"
          userLevel="member"
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onPostClick={handlePostClick}
          loadMoreRef={loadMoreRef}
        />
      </div>
    </div>
  );
}
