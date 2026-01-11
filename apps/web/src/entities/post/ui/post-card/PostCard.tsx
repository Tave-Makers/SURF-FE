'use client';

import { memo } from 'react';
import { SurfIcon } from '@surf/ui/icon';
import { PostBadge } from '@/entities/post/ui/post-badge/PostBadge';
import { Post } from '../../model/types';
import { stripHtml } from '@/shared/lib/stripHtml';
import { toDate, toKST, timeAgo } from '@/shared/utils/date';
import Image from 'next/image';

type PostCardProps = {
  post: Post;
  onClick?: () => void;
  onLikeToggle?: (newState: boolean) => void;
  shouldShowCategoryBadge?: boolean;
  shouldShowReservationBadge?: boolean;
};

function PostCardComponent({
  post,
  onClick,
  onLikeToggle,
  shouldShowCategoryBadge,
  shouldShowReservationBadge,
}: PostCardProps) {
  const {
    title,
    content,
    writer,
    likeCount,
    isLiked,
    isReserved,
    commentCount,
    categoryName,
    thumbnailUrl,
  } = post;

  const rawDate = post.date;
  const dateObj = toKST(toDate(rawDate));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) return;
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
          {shouldShowCategoryBadge && <PostBadge type="category" label={categoryName} />}

          {shouldShowReservationBadge && isReserved && <PostBadge type="reservation" />}
        </div>

        {/* 본문 */}
        <div className="flex flex-col items-start gap-5 self-stretch">
          <h3 className="text-body-body6 text-foreground-normal line-clamp-2">{title}</h3>
          <p className="text-body-body7 text-foreground-normal-lighter line-clamp-1">
            {stripHtml(content)}
          </p>

          <footer className="text-caption-caption2 text-foreground-tertiary flex items-center gap-5">
            <span>{writer}</span>
            <span>|</span>
            <time dateTime={rawDate}>{timeAgo(dateObj)}</time>
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
                className={isLiked ? 'text-foreground-danger fill-foreground-danger' : ''}
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
          <Image
            src={thumbnailUrl}
            alt={`${title} 관련 이미지`}
            className="object-cover"
            loading="lazy"
            width={70}
            height={70}
          />
        </div>
      )}
    </div>
  );
}

export const PostCard = memo(PostCardComponent);
