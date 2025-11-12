'use client';

import { useState } from 'react';
import { EventCard } from '@/entities/calendar/ui/EventCard';
import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { ChipToggle } from '@/shared/ui/chip-toggle/ChipToggle';

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

  // 이미지 모달 상태
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            <button
              key={img.imageId}
              className="w-full"
              onClick={() => setSelectedImage(img.originalUrl)}
            >
              <img
                src={img.originalUrl}
                alt={`post-image-${img.imageId}`}
                className="w-full cursor-pointer rounded-[0.5rem]"
              />
            </button>
          ))}
        </div>
      )}

      {/* 일정카드 */}
      {post.hasSchedule && (
        <EventCard title="후반기 만남의 장" type="official" mode="reservation" place="추후 공지" />
      )}

      {/* 좋아요 및 스크랩 */}
      <div className="flex justify-between">
        <ChipToggle
          isClicked={liked}
          count={likeCount}
          onToggleIcon={handleLikeToggle}
          iconName="Heart"
          activeColor="foreground-foreground-danger"
          onClickNumber={() => alert('좋아요 누른 사람 목록')}
        />
        <ChipToggle
          isClicked={scrapped}
          count={scrapCount}
          onToggleIcon={handleScrapToggle}
          activeColor="background-background-primary"
          iconName="Bookmark"
        />
      </div>

      {/* 이미지 확대 모달 - 임시 */}
      {selectedImage && (
        <button
          className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 px-13"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="enlarged" className="w-full rounded-[0.5rem]" />
        </button>
      )}
    </div>
  );
}
