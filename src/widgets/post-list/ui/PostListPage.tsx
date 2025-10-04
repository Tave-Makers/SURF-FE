'use client';

import { useEffect, useRef } from 'react';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { transformApiResponseToPosts } from '@/entities/post/api/mappers';
import type { PostContent } from '@/entities/post/api/types';
import { PostList } from '@/widgets/post-list/ui/PostList';

// 서버 응답 data 페이지 당 타입
type ApiPage = {
  content: PostContent[];
};

// 무한 스크롤 훅 응답 타입
type UseInfinitePostsQueryResult = UseInfiniteQueryResult<InfiniteData<ApiPage, unknown>, Error>;

type PostListPageProps = {
  useInfiniteQueryHook: (size: number, sort: string[]) => UseInfinitePostsQueryResult;
  // 추후 MVP에서 단일 페이지 조회 훅도 추가 될 수 있음
};

export function PostListPage({ useInfiniteQueryHook }: PostListPageProps) {
  // 화면 하단 DOM 요소 참조
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const size = 10;
  const sort: string[] = []; // 추후 정렬 기능 구현 시 동적으로 변경

  // Prop으로 전달받은 훅 사용
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQueryHook(size, sort);

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allPosts = data?.pages.flatMap((page) => transformApiResponseToPosts(page)) ?? [];

  // IntersectionObserver로 sentinel 감시
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      // sentinel 요소가 화면에 보이면 다음 페이지를 불러오기
      if (entries[0].isIntersecting) {
        fetchNextPage().catch((err) => {
          console.error('fetchNextPage error:', err);
        });
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

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
