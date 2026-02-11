'use client';

import { ChipToggle } from '@surf/ui/chip-toggle';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import sanitizeHtml, { IOptions } from 'sanitize-html';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { PostScheduleData } from '@/entities/post/api/types';
import { PostDetail } from '@/entities/post/model/types';
import { PostImage } from '@/entities/post/ui/post-image/PostImage';
import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { useToggleLikeMutation } from '@/features/post/model/useToggleLikeMutation';
import { useToggleScrapMutation } from '@/features/post/model/useToggleScrapMutation';
import { PAGE_ROUTES } from '@/shared/config/path';

type PostBodySectionProps = {
  post: PostDetail;
  schedule?: PostScheduleData;
  onClickLikeCount: () => void;
};

export const PostBodySection = ({ post, schedule, onClickLikeCount }: PostBodySectionProps) => {
  const router = useRouter();

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

  // 이벤트 카드 클릭 시 캘린더 화면으로 이동
  const handleEventCardClick = () => {
    if (!schedule) return;
    const date = new Date(schedule.startAt);
    const dateStr = format(date, 'yyyy-MM-dd');
    router.push(`${PAGE_ROUTES.CALENDAR.MAIN}?date=${dateStr}`);
  };

  return (
    <div className="flex flex-col gap-16">
      <PostProfile
        memberId={post.memberId}
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
          category={schedule.category}
          mode="reservation"
          location={schedule.location}
          startDate={new Date(schedule.startAt)}
          endDate={new Date(schedule.endAt)}
          onClickCard={handleEventCardClick}
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
          mode="count"
        />

        <ChipToggle
          isClicked={post.scrappedByMe}
          count={post.scrapCount}
          onToggleIcon={handleScrapToggle}
          iconName="Bookmark"
          activeColor="blue"
          mode="text"
        >
          스크랩
        </ChipToggle>
      </div>
    </div>
  );
};
