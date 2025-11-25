'use client';

import { useState } from 'react';

import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { ChipToggle } from '@/shared/ui/chip-toggle/ChipToggle';
import { PostDetail } from '@/entities/post/model/types';
import { useToggleLikeMutation } from '@/features/post/model/useToggleLikeMutation';
import { useToggleScrapMutation } from '@/features/post/model/useToggleScrapMutation';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import sanitizeHtml, { IOptions } from 'sanitize-html';

export function PostBodySection({ post }: { post: PostDetail }) {
  // 좋아요 & 스크랩 상태 관리
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [scrapped, setScrapped] = useState(post.scrappedByMe);
  const [scrapCount, setScrapCount] = useState(post.scrapCount);

  const likeMutation = useToggleLikeMutation();
  const scrapMutation = useToggleScrapMutation();

  // 좋아요 토글 핸들러

  const handleLikeToggle = () => {
    if (likeMutation.isPending) return;

    const prevLiked = liked;
    const prevLikeCount = likeCount;

    // optimistic update
    if (prevLiked) {
      // 지금 눌려 있었으면 → 해제
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // 지금 안 눌려 있었으면 → 설정
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    likeMutation.mutate(
      { postId: post.postId, liked: prevLiked },
      {
        onError: () => {
          setLiked(prevLiked);
          setLikeCount(prevLikeCount);
        },
      },
    );
  };

  // 스크랩 토글 핸들러
  const handleScrapToggle = () => {
    if (scrapMutation.isPending) return;

    const prevScrapped = scrapped;
    const prevScrapCount = scrapCount;

    // optimistic update
    if (prevScrapped) {
      setScrapped(false);
      setScrapCount((prev) => prev - 1);
    } else {
      setScrapped(true);
      setScrapCount((prev) => prev + 1);
    }

    scrapMutation.mutate(
      { postId: post.postId, scrapped: prevScrapped },
      {
        onError: () => {
          setScrapped(prevScrapped);
          setScrapCount(prevScrapCount);
        },
      },
    );
  };

  const sanitizeOptions: IOptions = {
    allowedTags: ['p', 'strong'],
  };

  const cleanContent = sanitizeHtml(post.content, sanitizeOptions);

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <PostProfile
        nickname={post.writer}
        date={post.date}
        time={post.time}
        viewCount={post.viewCount}
      />
      <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: cleanContent }} />

      {/* 이미지 목록 */}
      {post.imageUrlList && post.imageUrlList.length > 0 && (
        <div className="flex flex-col gap-[0.62rem]">
          {post.imageUrlList.map((img) =>
            img.originalUrl && img.originalUrl.trim() !== '' ? (
              <div key={img.imageId} className="w-full">
                <img
                  src={img.originalUrl}
                  alt={`post-image-${img.imageId}`}
                  className="w-full rounded-[0.5rem]"
                />
              </div>
            ) : null,
          )}
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
          activeColor="red"
          onClickNumber={() => alert('좋아요 누른 사람 목록')}
        />
        <ChipToggle
          isClicked={scrapped}
          count={scrapCount}
          onToggleIcon={handleScrapToggle}
          activeColor="blue"
          iconName="Bookmark"
        />
      </div>
    </div>
  );
}
