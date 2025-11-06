'use client';

import type { MouseEvent } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { Post } from '../model/types';

export type PostCardProps = {
  post: Post;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const PostCard = ({ post, onClick }: PostCardProps) => {
  const { state = 'default', title, content, writer, date, likes, comments, thumbnailUrl } = post;

  return (
    <button
      type="button"
      className="flex w-full flex-row items-center gap-15 self-stretch py-10"
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col gap-[0.37rem] self-stretch">
        {state === 'reserved' ? (
          <div className="text-caption-10-600--1 bg-border-border-normal text-foreground-accent rounded-max flex h-fit w-fit items-center justify-center gap-10 px-8 py-3">
            예약중
          </div>
        ) : null}
        {/* title, content, footer 영역 */}
        <div className="flex flex-col items-start gap-5 self-stretch">
          <div className="text-body-body7 text-foreground-foreground-normal line-clamp-1 overflow-hidden text-ellipsis">
            {title}
          </div>
          <div className="text-body-body8 text-foreground-foreground-normal-lighter line-clamp-1 overflow-hidden text-ellipsis">
            {content}
          </div>
          <div className="text-foreground-foreground-tertiary flex flex-row items-center gap-5">
            <div className="text-caption-caption4">{writer}</div>
            <div className="text-xs leading-none font-medium">|</div>
            <div className="text-caption-caption4">{date}</div>
            <div className="text-xs leading-none font-medium">|</div>
            <div className="flex flex-row gap-5">
              <div className="flex items-center gap-3">
                <SurfIcon size="s" name="Heart" />
                <span className="text-caption-caption4">{likes}</span>
              </div>
              <div className="flex items-center gap-3">
                <SurfIcon size="s" name="Chat" />
                <span className="text-caption-caption4">{comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사진 영역 */}
      <div className="bg-background-background-secondary aspect-square h-[3.75rem] w-[3.75rem] overflow-hidden rounded-[0.12rem]">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
    </button>
  );
};
