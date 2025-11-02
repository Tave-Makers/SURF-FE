'use client';

import type { MouseEvent, KeyboardEvent } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { Post } from '../model/types';
import { PostTag } from './PostTag';

export type PostCardProps = {
  post: Post;
  onClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  onLikeToggle?: (newState: boolean) => void;
};

export const PostCard = ({ post, onClick, onLikeToggle }: PostCardProps) => {
  const { tags, title, content, writer, date, likeCount, isLiked, commentCount, thumbnailUrl } =
    post;

  const handleLikeToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLikeToggle?.(!isLiked);
  };

  /** 키보드 접근성: Enter나 Space로 카드 클릭 가능 */
  const handleKeyPress = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <article
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      tabIndex={0}
      className="flex w-full cursor-pointer flex-row items-center gap-15 self-stretch rounded-lg px-15 py-10"
      onClick={onClick}
      onKeyDown={handleKeyPress}
      aria-label={`게시글: ${title}`}
    >
      <div className="flex flex-1 flex-col gap-8 self-stretch">
        {/* PostTag 영역 */}
        <div className="flex gap-5">
          {tags?.map((tag) => (
            <PostTag key={tag.variation} variation={tag.variation} />
          ))}
        </div>

        {/* title, content 영역 */}
        <div className="flex flex-col items-start gap-5 self-stretch">
          <h3
            className="text-body-body5 text-foreground-foreground-normal line-clamp-1 overflow-hidden text-ellipsis"
            aria-label="게시글 제목"
          >
            {title}
          </h3>
          <p
            className="text-body-body6 text-foreground-foreground-normal-lighter line-clamp-1 overflow-hidden text-ellipsis"
            aria-label="게시글 내용"
          >
            {content}
          </p>

          {/* postcard footer 영역 */}
          <footer
            className="text-caption-caption2 text-foreground-foreground-tertiary flex flex-row items-center gap-5"
            aria-label="게시글 정보"
          >
            <span>{writer}</span>
            <span className="overflow-hidden text-[0.75rem] leading-none font-semibold">|</span>
            <time dateTime={date}>{date}</time>
            <span className="overflow-hidden text-[0.75rem] leading-none font-semibold">|</span>

            {/* 좋아요 버튼 */}
            <button
              type="button"
              className="flex items-center gap-5"
              aria-label={`좋아요 ${likeCount}개`}
              aria-pressed={isLiked}
              onClick={handleLikeToggle}
            >
              <SurfIcon
                name="Heart"
                size="s"
                aria-hidden="true"
                className={`shrink-0 ${
                  isLiked
                    ? 'text-foreground-foreground-danger fill-foreground-foreground-danger'
                    : ''
                }`}
              />
              <span aria-hidden="true">{likeCount}</span>
            </button>

            {/* 댓글 수 표시 */}
            <div className="flex items-center gap-5" aria-label={`댓글 ${commentCount}개`}>
              <SurfIcon name="Chat" size="s" aria-hidden="true" />
              <span aria-hidden="true">{commentCount}</span>
            </div>
          </footer>
        </div>
      </div>

      {/* 사진 영역 */}
      <div className="bg-foreground-foreground-tertiary aspect-square h-[4.375rem] w-[4.375rem] overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${title} 관련 이미지`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="sr-only">이미지가 없습니다</span>
        )}
      </div>
    </article>
  );
};
