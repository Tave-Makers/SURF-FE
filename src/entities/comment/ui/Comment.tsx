import { SurfIcon } from '../../../shared/ui/icon/SurfIcon';
import { ProfileImage } from '../../../shared/ui/profile-image/ProfileImage';

type CommentProps = {
  name: string;
  date: string;
  time: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  onLikeToggle?: (newState: boolean) => void;
  onReplyClick?: () => void;
  onMoreClick?: () => void;
};

const Comment = ({
  name,
  date,
  time,
  content,
  likeCount,
  isLiked,
  onLikeToggle,
  onReplyClick,
  onMoreClick,
}: CommentProps) => {
  const handleLikeToggle = () => {
    onLikeToggle?.(!isLiked);
  };

  return (
    <article className="flex flex-1 gap-11" aria-label={`${name}님의 댓글`}>
      <ProfileImage size="s" alt={`${name}님의 프로필 이미지`} />

      <div className="flex flex-1 flex-col gap-7">
        {/* 이름, 날짜, 시간, 더보기 */}
        <header className="flex items-center">
          <div className="flex gap-8">
            <p className="text-body-body7 text-foreground-foreground-normal">{name}</p>
            <p className="text-caption-caption6 text-foreground-foreground-quinary-darker flex items-center gap-5">
              <time>{date}</time>
              <time>{time}</time>
            </p>
          </div>
          <button type="button" aria-label="댓글 더보기" className="ml-auto" onClick={onMoreClick}>
            <SurfIcon name="Dots" size="m" />
          </button>
        </header>

        {/* 댓글 내용 */}
        <p className="text-body-body8 text-foreground-foreground-normal">{content}</p>

        {/* 좋아요, 답글 */}
        <footer className="flex gap-11">
          <button
            type="button"
            className="text-caption-caption4 text-foreground-foreground-secondary-lighter flex items-center gap-5"
            aria-label={`좋아요 ${likeCount}개`}
            onClick={handleLikeToggle}
          >
            <SurfIcon
              name="Heart"
              size="s"
              aria-hidden="true"
              className={`shrink-0 ${
                isLiked
                  ? 'text-foreground-foreground-danger fill-foreground-foreground-danger'
                  : 'text-foreground-foreground-normal'
              }`}
            />
            <span aria-hidden="true">{likeCount}</span>
          </button>

          <button
            type="button"
            className="text-caption-caption4 text-foreground-foreground-secondary-lighter flex items-center gap-5"
            aria-label="답글 달기"
            onClick={onReplyClick}
          >
            <SurfIcon name="Chat" size="s" aria-hidden="true" />
            <span aria-hidden="true">답글달기</span>
          </button>
        </footer>
      </div>
    </article>
  );
};

export default Comment;
