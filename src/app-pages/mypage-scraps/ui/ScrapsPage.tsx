'use client';

import { useInfiniteScraps } from '@/features/post/model/useScraps';
import { transformApiResponseToPosts } from '@/entities/post/api/mappers';
import { PostContent } from '@/entities/post/api/types';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useEffect, useRef } from 'react';
import { PostList } from '@/widgets/post-list/ui/PostList';

export default function ScrapsPage() {
  const { accessToken } = useAuthStore();
  // 화면 하단 DOM 요소 참조
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const size = 10;
  // 추후 MVP에서 sort 관련 코드 작성 필요

  // 스크랩한 게시글 무한 스크롤 조회
  const {
    data: scrapsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteScraps(size, [], { enabled: !!accessToken });

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allPosts =
    scrapsData?.pages.flatMap((page) =>
      transformApiResponseToPosts(page as { content: PostContent[] }),
    ) ?? [];

  // IntersectionObserver로 sentinel 감시
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((posts) => {
      if (posts[0].isIntersecting) {
        // sentinel이 화면에 보이면 다음 페이지 요청
        fetchNextPage().catch((err) => {
          console.error('fetchNextPage 에러', err);
        });
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // 인증되지 않은 경우 화면
  if (!accessToken) {
    return <div>로그인이 필요합니다. 로그인 페이지로 이동합니다...</div>;
  }

  // 에러 발생 화면
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

  return (
    <PostList
      posts={allPosts}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onPostClick={(post) => console.log(`Post ${post.id} clicked`)}
      loadMoreRef={loadMoreRef}
    />
  );
}
