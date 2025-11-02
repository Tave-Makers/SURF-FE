import { SurfIcon } from '../../../shared/ui/icon/SurfIcon';
import { ProfileImage } from '../../../shared/ui/profile-image/ProfileImage';

/**
 * 댓글(Comment) 컴포넌트
 *
 * @description
 * - 프로필, 작성자, 날짜/시간, 내용, 좋아요, 답글, 더보기 표시
 * - 모든 사용자 액션(좋아요, 답글, 더보기)은 콜백을 통해 상위에서 처리
 *
 * @prop name 작성자 이름
 * @prop date 작성 날짜 (예: 2026.10.16)
 * @prop time 작성 시간 (예: 01:21)
 * @prop content 댓글 내용
 * @prop likeCount 좋아요 개수
 * @prop isLiked 좋아요 여부
 * @prop onLikeToggle 좋아요 클릭 콜백 (newState: true=좋아요, false=취소)
 * @prop onReplyClick 답글 클릭 콜백
 * @prop onMoreClick 더보기 클릭 콜백
 *
 * @example
 * ```tsx
 * const [isLiked, setIsLiked] = useState(false);
 * const [count, setCount] = useState(42);
 *
 * <Comment
 *   name="김테이브"
 *   date="2026.10.16"
 *   time="01:21"
 *   content="좋은 글이네요! 😊"
 *   likeCount={count}
 *   isLiked={isLiked}
 *   onLikeToggle={(newState) => {
 *     setIsLiked(newState);
 *     setCount((prev) => prev + (newState ? 1 : -1));
 *   }}
 *   onReplyClick={() => console.log('답글 클릭')}
 *   onMoreClick={() => console.log('더보기 클릭')}
 * />
 * ```
 */

type CommentProps = {
  name: string;
  profileImageUrl?: string;
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
  profileImageUrl,
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
      <ProfileImage src={profileImageUrl} size="s" alt={`${name}님의 프로필 이미지`} />

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
