'use client';

import { ChipToggle } from '@surf/ui/chip-toggle';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import sanitizeHtml, { IOptions } from 'sanitize-html';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { PostScheduleData } from '@/entities/post/api/types';
import { PostDetail } from '@/entities/post/model/types';
import { FileCard } from '@/entities/post/post-file/ui/FileCard';
import { PostImage } from '@/entities/post/ui/post-image/PostImage';
import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { trackPostDetailEvent } from '@/features/post/lib/trackPostDetailEvent';
import { POST_DETAIL_EVENTS } from '@/features/post/model/types';
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
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    openAlert({
      state: 'default',
      title: '파일을 다운로드하시겠습니까?',
      infoText: fileName,
      actions: [
        { type: 'solid', label: '취소', variant: 'secondary', onClick: closeAlert },
        {
          type: 'solid',
          label: '다운로드',
          variant: 'primary',
          onClick: () => {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
            closeAlert();
          },
        },
      ],
    });
  };

  // 좋아요/스크랩 Mutation
  const likeMutation = useToggleLikeMutation();
  const scrapMutation = useToggleScrapMutation();

  // 좋아요 토글
  const handleLikeToggle = () => {
    if (likeMutation.isPending) return;

    const nextState = post.likedByMe ? 'off' : 'on';

    trackPostDetailEvent(POST_DETAIL_EVENTS.LIKE, {
      target_type: 'post',
      target_id: post.postId,
      state: nextState,
    });

    likeMutation.mutate({
      postId: post.postId,
      liked: post.likedByMe,
    });
  };

  // 스크랩 토글
  const handleScrapToggle = () => {
    if (scrapMutation.isPending) return;

    const nextState = post.scrappedByMe ? 'off' : 'on';

    trackPostDetailEvent(POST_DETAIL_EVENTS.SCRAP, {
      target_type: 'post',
      target_id: post.postId,
      state: nextState,
    });

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

      <div className="flex flex-col gap-10">
        {/* 이미지 목록 */}
        {post.imageUrlList?.map((img) =>
          img.originalUrl?.trim() ? (
            <PostImage key={img.imageId} src={img.originalUrl} alt={img.originalUrl} />
          ) : null,
        )}
        {/* 첨부 파일 목록 */}
        {post.fileList?.map((file) => (
          <button
            key={file.fileId}
            type="button"
            className="w-full text-left"
            onClick={() => handleFileDownload(file.fileUrl, file.originalFileName)}
          >
            <FileCard fileName={file.originalFileName} />
          </button>
        ))}

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
      </div>

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
