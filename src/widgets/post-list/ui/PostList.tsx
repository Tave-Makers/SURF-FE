'use client';

import { PostCard } from '@/entities/post/ui/post-card/PostCard';
import type { Post, PostCategory } from '@/entities/post/model/types';
import type { UserLevel } from '@/entities/user/model/types';

type PostListProps = {
  posts: Post[];
  currentCategory: PostCategory;
  userLevel: UserLevel;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onPostClick?: (post: Post) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement | null>;
  showCategoryBadge?: boolean;
};

export const PostList = ({
  posts,
  currentCategory,
  userLevel,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onPostClick,
  loadMoreRef,
  showCategoryBadge = false,
}: PostListProps) => {
  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        게시글을 불러오는 중...
      </div>
    );
  }

  if (posts.length === 0) {
    return <div>게시글이 없습니다.</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-13 pt-12">
      {posts.map((post, index) => (
        <PostCard
          key={`${post.postId}-${index}`}
          post={post}
          currentCategory={currentCategory}
          userLevel={userLevel}
          onClick={() => onPostClick?.(post)}
          showCategoryBadge={showCategoryBadge}
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
};
