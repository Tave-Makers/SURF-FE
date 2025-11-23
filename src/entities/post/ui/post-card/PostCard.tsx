'use client';

import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { PostBadge } from '@/entities/post/ui/post-badge/PostBadge';
import type { Post } from '@/entities/post/model/types';
import type { UserLevel } from '@/entities/user/model/types';
import type { TabCategoryLabel } from '@/entities/post/model/types';

type PostCardProps = {
  post: Post;
  currentCategory?: TabCategoryLabel;
  userLevel: UserLevel;
  onClick?: () => void;
  onLikeToggle?: (newState: boolean) => void;
};

export const PostCard = ({
  post,
  currentCategory,
  userLevel,
  onClick,
  onLikeToggle,
}: PostCardProps) => {
  const {
    title,
    content,
    writer,
    date,
    likeCount,
    isLiked,
    commentCount,
    categoryName,
    isReserved,
    thumbnailUrl,
  } = post;

  // 탭이 "전체"일 때만 카테고리 배지 표시
  const shouldShowCategoryBadge = currentCategory === '전체';

  // 예약중 배지는 member가 아닐 때만 표시
  const showReservationBadge = isReserved && userLevel !== 'member';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="flex w-full cursor-pointer flex-row items-center gap-15 self-stretch py-10"
      aria-label={`게시글: ${title}`}
    >
      <div className="flex flex-1 flex-col gap-8 self-stretch">
        {/* 뱃지 */}
        <div className="flex gap-5">
          {shouldShowCategoryBadge && <PostBadge type="category" category={categoryName} />}

          {showReservationBadge && <PostBadge type="reservation" />}
        </div>

        {/* 본문 */}
        <div className="flex flex-col items-start gap-5 self-stretch">
          <h3 className="text-body-body5 text-foreground-foreground-normal line-clamp-2">
            {title}
          </h3>
          <p className="text-body-body6 text-foreground-foreground-normal-lighter line-clamp-1">
            {content}
          </p>

          <footer className="text-caption-caption2 text-foreground-foreground-tertiary flex items-center gap-5">
            <span>{writer}</span>
            <span>|</span>
            <time dateTime={date}>{date}</time>
            <span>|</span>

            {/* 좋아요 */}
            <button
              type="button"
              className="flex items-center gap-3"
              aria-pressed={isLiked}
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle?.(!isLiked);
              }}
            >
              <SurfIcon
                name="Heart"
                size="s"
                className={
                  isLiked
                    ? 'text-foreground-foreground-danger fill-foreground-foreground-danger'
                    : ''
                }
              />
              <span>{likeCount > 99 ? '99+' : likeCount}</span>
            </button>

            {/* 댓글 */}
            <div className="flex items-center gap-3">
              <SurfIcon name="Chat" size="s" />
              <span>{commentCount > 99 ? '99+' : commentCount}</span>
            </div>
          </footer>
        </div>
      </div>

      {/* 썸네일 */}
      {thumbnailUrl && (
        <div className="aspect-square h-[4.375rem] w-[4.375rem] overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={`${title} 관련 이미지`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};
