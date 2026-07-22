import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import type { MentionResponse } from '@/features/comment/api/types';

/**
 * 댓글(Comment) 컴포넌트
 *
 * @description
 * - 프로필, 작성자, 날짜/시간, 내용, 좋아요, 답글, 더보기 표시
 * - 모든 사용자 액션(좋아요, 답글, 더보기)은 콜백을 통해 상위에서 처리
 *
 * @prop name 작성자 이름
 * @prop date 작성 날짜 및 시간
 * @prop content 댓글 내용
 * @prop likeCount 좋아요 개수
 * @prop isLiked 좋아요 여부
 * @prop onLikeToggle 좋아요 클릭 콜백 (newState: true=좋아요, false=취소)
 * @prop onReplyClick 답글 클릭 콜백
 * @prop onMoreClick 더보기 클릭 콜백
 * @prop isActionDisabled 좋아요/답글 액션 비활성화 여부
 */

interface CommentProps {
  name: string;
  profileImageUrl?: string | null;
  date: string;
  content: string;
  mentions?: MentionResponse[];
  likeCount: number;
  isLiked: boolean;
  onLikeToggle?: (newState: boolean) => void;
  onProfileClick?: () => void;
  onReplyClick?: () => void;
  onMoreClick?: () => void;
  isActionDisabled?: boolean;
}

function renderContentWithMentions(content: string, mentions: MentionResponse[] | undefined) {
  const mentionSet = new Set((mentions ?? []).map((m) => m.nickname));

  const parts = content.split(/(@[^\s@]+\s)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('@')) {
      const nickname = part.slice(1).trim();
      if (mentionSet.has(nickname)) {
        return (
          <span key={idx} className="text-foreground-primary">
            {part}
          </span>
        );
      }
    }
    return <span key={idx}>{part}</span>;
  });
}

export const Comment = ({
  name,
  profileImageUrl,
  date,
  content,
  mentions,
  likeCount,
  isLiked,
  onLikeToggle,
  onProfileClick,
  onReplyClick,
  onMoreClick,
  isActionDisabled = false,
}: CommentProps) => {
  const handleLikeToggle = () => {
    if (isActionDisabled) return;
    onLikeToggle?.(!isLiked);
  };
  const isProfileClickable = Boolean(onProfileClick);

  return (
    <article className="flex w-full gap-11" aria-label={`${name}님의 댓글`}>
      <Avatar
        src={profileImageUrl ?? undefined}
        size="s"
        alt={`${name}님의 프로필 이미지`}
        className={isProfileClickable ? 'cursor-pointer' : 'cursor-default'}
        onClick={onProfileClick}
      />

      <div className="flex w-full flex-col gap-7">
        {/* 이름, 날짜, 시간, 더보기 */}
        <header className="flex items-center">
          <div className="flex gap-8">
            <p className="text-body-body6 text-foreground-normal">{name}</p>
            <p className="text-caption-caption4 text-foreground-quinary-darker flex items-center">
              <time>{date}</time>
            </p>
          </div>
          <button type="button" aria-label="댓글 더보기" className="ml-auto" onClick={onMoreClick}>
            <SurfIcon name="Dots" size="m" />
          </button>
        </header>

        {/* 댓글 내용 */}
        <p className="text-body-body7 text-foreground-normal">
          {renderContentWithMentions(content, mentions)}
        </p>

        {/* 좋아요, 답글 */}
        <footer className="flex gap-11">
          <button
            type="button"
            className="text-caption-caption4 text-foreground-secondary-lighter flex items-center gap-5"
            aria-label={`좋아요 ${likeCount}개`}
            onClick={handleLikeToggle}
            disabled={isActionDisabled}
          >
            <SurfIcon
              name="Heart"
              size="s"
              aria-hidden="true"
              className={`shrink-0 ${
                isLiked ? 'text-foreground-danger fill-foreground-danger' : 'text-foreground-normal'
              }`}
            />
            <span aria-hidden="true">{likeCount}</span>
          </button>

          <button
            type="button"
            className="text-caption-caption4 text-foreground-secondary-lighter flex items-center gap-5"
            aria-label="답글 달기"
            onClick={onReplyClick}
            disabled={isActionDisabled}
          >
            <SurfIcon name="Chat" size="s" aria-hidden="true" />
            <span aria-hidden="true">답글달기</span>
          </button>
        </footer>
      </div>
    </article>
  );
};
