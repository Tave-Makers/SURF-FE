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
      className="border-border-secondary flex w-full flex-row items-center gap-[1.25rem] self-stretch border-b border-solid py-[1rem]"
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col gap-[0.37rem] self-stretch">
        {state === 'reserved' ? (
          <div className="text-caption-10-600--1 bg-border-normal text-foreground-accent flex h-fit w-fit items-center justify-center gap-[0.62rem] rounded-[62.43rem] px-[0.5rem] py-[0.125rem]">
            예약중
          </div>
        ) : (
          <></>
        )}
        {/* title, content 영역 */}
        <div className="flex flex-col items-start gap-[0.12rem] self-stretch">
          <div className="text-body-14-600--1-20 text-foreground-normal line-clamp-1 overflow-hidden text-ellipsis">
            {title}
          </div>
          <div className="text-body-14-400--2-22 text-foreground-normal line-clamp-1 overflow-hidden text-ellipsis">
            {content}
          </div>
        </div>

        {/* postcard footer 영역 */}
        <div className="text-foreground-hint flex flex-row items-center gap-[0.25rem]">
          <div className="text-caption-12-400">{writer}</div>
          <div className="font-pretendard text-[0.75rem] leading-none font-medium">|</div>
          <div className="text-caption-12-400">{date}</div>
          <div className="font-pretendard text-[0.75rem] leading-none font-medium">|</div>
          <div className="flex items-center gap-[0.12rem]">
            <SurfIcon size="s" name="Heart" />
            <span className="text-caption-12-400">{likes}</span>
          </div>
          <div className="font-pretendard text-[0.75rem] leading-none font-medium">|</div>
          <div className="flex items-center gap-[0.12rem]">
            <SurfIcon size="s" name="Chat" />
            <span className="text-caption-12-400">{comments}</span>
          </div>
        </div>
      </div>

      {/* 사진 영역 */}
      <div className="bg-foreground-hint aspect-square h-[3.75rem] w-[3.75rem] overflow-hidden rounded-[0.12rem]">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
    </button>
  );
};
