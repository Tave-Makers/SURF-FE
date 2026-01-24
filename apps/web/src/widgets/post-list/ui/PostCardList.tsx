'use client';

// import dynamic from 'next/dynamic';
import { memo } from 'react';
import type { TabCategoryLabel } from '@/entities/post/model/tab';
import type { Post } from '@/entities/post/model/types';
import { PostCard } from '@/entities/post/ui/post-card/PostCard';
import type { UserLevel } from '@/entities/user/model/types';
import PostEmpty from '@/shared/assets/icons/empty-space/posts-empty.svg';

// const PostEmpty = dynamic(() => import('@/shared/assets/icons/empty-space/posts-empty.svg'), {
//   ssr: false,
//     loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
// });

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

const PostCardListComponent = ({
  posts,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onPostClick,
  loadMoreRef,
  shouldShowCategoryBadge,
  shouldShowReservationBadge,
  error = null,
}: PostCardListProps) => {
  if (isLoading) {
    // 임시
    return <div role="status" aria-live="polite" />;
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
    return (
      <div className="flex h-full flex-col items-center gap-[0.43rem] pt-[15.38rem]">
        <PostEmpty className="h-[4.72rem] w-[4.79rem]" />
        <div className="flex flex-col items-center">
          <div className="text-body-body8 text-foreground-tertiary">아무도 글을</div>
          <div className="text-body-body8 text-foreground-tertiary">작성하지 않았어요</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onClick={() => onPostClick?.(post)}
          shouldShowCategoryBadge={shouldShowCategoryBadge}
          shouldShowReservationBadge={shouldShowReservationBadge}
        />
      ))}

      <div
        ref={loadMoreRef}
        className="text-body-body8 text-foreground-tertiary flex items-center justify-center"
      >
        {isFetchingNextPage ? '더 많은 게시글을 불러오는 중...' : hasNextPage ? '더 불러오기' : ''}
      </div>
    </div>
  );
};

export const PostCardList = memo(PostCardListComponent);
