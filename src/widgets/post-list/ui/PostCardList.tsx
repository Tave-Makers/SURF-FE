'use client';

import { memo } from 'react';
import { PostCard } from '@/entities/post/ui/post-card/PostCard';
import type { UserLevel } from '@/entities/user/model/types';
import type { TabCategoryLabel } from '@/entities/post/model/tab';
import type { Post } from '@/entities/post/model/types';

type PostCardListProps = {
  posts: Post[];
  currentTabCategory?: TabCategoryLabel;
  userLevel: UserLevel;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onPostClick?: (post: Post) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement | null>;
  shouldShowCategoryBadge?: boolean;
  shouldShowReservationBadge?: boolean;
  error?: Error | null;
};

function PostCardListComponent({
  posts,
  currentTabCategory,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onPostClick,
  loadMoreRef,
  shouldShowCategoryBadge,
  shouldShowReservationBadge,
  error = null,
}: PostCardListProps) {
  if (isLoading) {
    // 임시
    return (
      <div role="status" aria-live="polite">
        게시글을 불러오는 중...
      </div>
    );
  }
  if (error) {
    // 임시
    return (
      <div role="alert" className="text-foreground-danger py-20 text-center">
        게시글을 불러오는 중 오류가 발생했습니다.
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }
  if (posts.length === 0) {
    return <div>게시글이 없습니다.</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          currentTabCategory={currentTabCategory}
          onClick={() => onPostClick?.(post)}
          shouldShowCategoryBadge={shouldShowCategoryBadge}
          shouldShowReservationBadge={shouldShowReservationBadge}
        />
      ))}

      <div
        ref={loadMoreRef}
        className="text-body-14-600--1-20 text-foreground-hint flex items-center justify-center py-[1rem]"
      >
        {isFetchingNextPage
          ? '더 많은 게시글을 불러오는 중...'
          : hasNextPage
            ? '더 불러오기'
            : '모든 게시글을 불러왔습니다.'}
      </div>
    </div>
  );
}

export const PostCardList = memo(PostCardListComponent);
