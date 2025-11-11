'use client';

import { useState } from 'react';
import { EventCard } from '@/entities/calendar/ui/EventCard';
import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import LikeButton from '@/shared/ui/button/like-button/LikeButton';
import ScrapButton from '@/shared/ui/button/scrap-button/ScrapButton';

// 타입 정의 그대로 유지
export type PostImage = {
  imageId: number;
  originalUrl: string;
  sequence: number;
};

export type PostDetail = {
  id: number;
  title: string;
  content: string;
  postedAt: string;
  boardId: number;
  nickname: string;
  likeCount: number;
  likedByMe: boolean;
  scrapCount: number;
  scrappedByMe: boolean;
  hasSchedule: boolean;
  imageUrlList?: PostImage[];
};

type PostBodyProps = Pick<
  PostDetail,
  | 'nickname'
  | 'postedAt'
  | 'content'
  | 'likeCount'
  | 'likedByMe'
  | 'scrapCount'
  | 'scrappedByMe'
  | 'imageUrlList'
  | 'hasSchedule'
>;

export function PostBodySection({ post }: { post: PostBodyProps }) {
  // 좋아요 & 스크랩 상태 관리
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [scrapped, setScrapped] = useState(post.scrappedByMe);
  const [scrapCount, setScrapCount] = useState(post.scrapCount);

  // 좋아요 토글 핸들러
  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  // 스크랩 토글 핸들러
  const handleScrapToggle = () => {
    setScrapped((prev) => !prev);
    setScrapCount((prev) => (scrapped ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <PostProfile nickname={post.nickname} date={post.postedAt} time="01:21" viewCount={3} />
      <div className="whitespace-pre-line">{post.content}</div>

      {/* 이미지 목록 */}
      {post.imageUrlList && post.imageUrlList.length > 0 && (
        <div className="flex flex-col gap-[0.62rem]">
          {post.imageUrlList.map((img) => (
            <div key={img.imageId} className="w-full">
              <img
                src={img.originalUrl}
                alt={`post-image-${img.imageId}`}
                className="w-full rounded-[0.5rem]"
              />
            </div>
          ))}
        </div>
      )}

      {/* 일정카드 */}
      {post.hasSchedule && (
        <EventCard title="후반기 만남의 장" type="official" mode="reservation" place="추후 공지" />
      )}

      {/* 좋아요 및 스크랩 */}
      <div className="flex justify-between">
        <LikeButton isLiked={liked} count={likeCount} onLikeToggle={handleLikeToggle} />
        <ScrapButton isScrapped={scrapped} count={scrapCount} onScrapToggle={handleScrapToggle} />
      </div>
    </div>
  );
}
