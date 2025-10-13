'use client';

import { PostCard } from '@/entities/post/ui/PostCard';
import { Post } from '@/entities/post/model/types';

type PostListProps = {
  posts: Post[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onPostClick?: (post: Post) => void;
  loadMoreRef?: React.RefObject<HTMLDivElement | null>;
};

export const PostList = ({
  posts,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onPostClick,
  loadMoreRef,
}: PostListProps) => {
  // 로딩 화면
  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        게시글을 불러오는 중...
      </div>
    );
  }

  // 게시글이 없을 때의 화면
  if (posts.length === 0) {
    return (
      <div>
        <div>게시글이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-[1rem]">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => onPostClick?.(post)} />
      ))}

      {/* 무한스크롤 sentinel */}
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
