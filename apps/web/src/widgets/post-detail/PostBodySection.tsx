'use client';

import { ChipToggle } from '@surf/ui/chip-toggle';
import sanitizeHtml, { IOptions } from 'sanitize-html';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { PostScheduleData } from '@/entities/post/api/types';
import { PostDetail } from '@/entities/post/model/types';
import { PostImage } from '@/entities/post/ui/post-image/PostImage';
import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { mapCategoryToActivityCategory } from '@/features/calendar/model/mapper';
import { useToggleLikeMutation } from '@/features/post/model/useToggleLikeMutation';
import { useToggleScrapMutation } from '@/features/post/model/useToggleScrapMutation';

type PostBodySectionProps = {
  post: PostDetail;
  schedule?: PostScheduleData;
  onClickLikeCount: () => void;
};

export const PostBodySection = ({ post, schedule, onClickLikeCount }: PostBodySectionProps) => {
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
      {schedule && (
        <EventCard
          scheduleId={schedule.scheduleId}
          title={schedule.title}
          category={mapCategoryToActivityCategory(schedule.category)}
          mode="reservation"
          location={schedule.location}
          startDate={new Date(schedule.startAt)}
          endDate={new Date(schedule.endAt)}
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
};
