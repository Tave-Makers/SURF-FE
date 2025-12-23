'use client';

import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { ChipToggle } from '@/shared/ui/chip-toggle/ChipToggle';
import { PostDetail } from '@/entities/post/model/types';
import { useToggleLikeMutation } from '@/features/post/model/useToggleLikeMutation';
import { useToggleScrapMutation } from '@/features/post/model/useToggleScrapMutation';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import sanitizeHtml, { IOptions } from 'sanitize-html';
import { PostImage } from '@/entities/post/ui/post-image/PostImage';
import { mapCategoryToActivityCategory } from '@/features/calendar/model/mapper';

type PostBodySectionProps = {
  post: PostDetail;
  onClickLikeCount: () => void;
};

export function PostBodySection({ post, onClickLikeCount }: PostBodySectionProps) {
  // 좋아요/스크랩 Mutation
  const likeMutation = useToggleLikeMutation();
  const scrapMutation = useToggleScrapMutation();

  // 좋아요 토글
  const handleLikeToggle = () => {
    if (likeMutation.isPending) return;

    likeMutation.mutate({
      postId: post.postId,
      liked: post.likedByMe,
    });
  };

  // 스크랩 토글
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
    <div className="flex flex-col gap-16">
      <PostProfile
        profileImgUrl={post.profileImageUrl}
        nickname={post.writer}
        date={post.date}
        time={post.time}
        viewCount={post.viewCount}
      />
      <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: cleanContent }} />

      {/* 이미지 목록 */}
      {post.imageUrlList?.map((img) =>
        img.originalUrl?.trim() ? (
          <PostImage key={img.imageId} src={img.originalUrl} alt={img.originalUrl} />
        ) : null,
      )}

      {/* 일정카드 */}
      {post.schedule && (
        <EventCard
          scheduleId={post.schedule.scheduleId}
          title={post.schedule.title}
          category={mapCategoryToActivityCategory(post.schedule.category)}
          mode="reservation"
          location={post.schedule.location}
          startDate={new Date(post.schedule.startAt)}
          endDate={new Date(post.schedule.endAt)}
        />
      )}

      {/* 좋아요 / 스크랩 */}
      <div className="flex justify-between">
        <ChipToggle
          isClicked={post.likedByMe}
          count={post.likeCount}
          onToggleIcon={handleLikeToggle}
          iconName="Heart"
          activeColor="red"
          onClickNumber={onClickLikeCount}
          mode="like"
        />

        <ChipToggle
          isClicked={post.scrappedByMe}
          count={post.scrapCount}
          onToggleIcon={handleScrapToggle}
          iconName="Bookmark"
          activeColor="blue"
          mode="scrap"
        />
      </div>
    </div>
  );
}
