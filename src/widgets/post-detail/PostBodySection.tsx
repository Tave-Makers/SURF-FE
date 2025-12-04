'use client';

import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { ChipToggle } from '@/shared/ui/chip-toggle/ChipToggle';
import { PostDetail } from '@/entities/post/model/types';
import { useToggleLikeMutation } from '@/features/post/model/useToggleLikeMutation';
import { useToggleScrapMutation } from '@/features/post/model/useToggleScrapMutation';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import sanitizeHtml, { IOptions } from 'sanitize-html';

export function PostBodySection({ post }: { post: PostDetail }) {
  const SAMPLE_START_DATE = new Date('2025-11-08T14:00:00');
  const SAMPLE_END_DATE = new Date('2025-11-08T18:00:00');

  const likeMutation = useToggleLikeMutation();
  const scrapMutation = useToggleScrapMutation();

  // 좋아요 토글 핸들러

  const handleLikeToggle = () => {
    if (likeMutation.isPending) return;

    likeMutation.mutate({
      postId: post.postId,
      liked: post.likedByMe,
    });
  };

  // 스크랩 토글 핸들러
  const handleScrapToggle = () => {
    if (scrapMutation.isPending) return;

    scrapMutation.mutate({
      postId: post.postId,
      scrapped: post.scrappedByMe,
    });
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
        <EventCard
          title="후반기 만남의 장"
          category="official"
          mode="reservation"
          location="추후 공지"
          id={1}
          startDate={SAMPLE_START_DATE}
          endDate={SAMPLE_END_DATE}
        />
      )}

      {/* 좋아요 및 스크랩 */}
      <div className="flex justify-between">
        <ChipToggle
          isClicked={post.likedByMe}
          count={post.likeCount}
          onToggleIcon={handleLikeToggle}
          iconName="Heart"
          activeColor="red"
          onClickNumber={() => alert('좋아요 누른 사람 목록')}
          mode="like"
        />
        <ChipToggle
          isClicked={post.scrappedByMe}
          count={post.scrapCount}
          onToggleIcon={handleScrapToggle}
          activeColor="blue"
          iconName="Bookmark"
          mode="scrap"
        />
      </div>
    </div>
  );
}
