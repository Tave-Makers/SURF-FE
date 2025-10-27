import { SurfIcon } from '../../../shared/ui/icon/SurfIcon';
import { ProfileImage } from '../../../shared/ui/profile-image/ProfileImage';

type CommentProps = {
  name: string;
  date: string;
  time: string;
  content: string;
  likes: number;
};

const Comment = ({ name, date, time, content, likes }: CommentProps) => {
  return (
    <article className="flex flex-1 gap-11" aria-label={`${name}님의 댓글`}>
      <ProfileImage size="s" alt={`${name}님의 프로필 이미지`} />

      <div className="flex flex-1 flex-col gap-7">
        {/* 이름, 날짜, 시간, 더보기 */}
        <header className="flex items-center">
          <div className="flex gap-8">
            <p
              className="text-body-body7 text-foreground-foreground-normal"
              aria-label="작성자 이름"
            >
              {name}
            </p>
            <p
              className="text-caption-caption6 text-foreground-foreground-quinary-darker flex items-center gap-5"
              aria-label="작성 시각"
            >
              <time>{date}</time>
              <time>{time}</time>
            </p>
          </div>
          <button type="button" aria-label="댓글 더보기" className="ml-auto">
            <SurfIcon name="Dots" size="m" />
          </button>
        </header>

        {/* 댓글 내용 */}
        <p className="text-body-body8 text-foreground-foreground-normal" aria-label="댓글 내용">
          {content}
        </p>

        {/* 좋아요, 답글 */}
        <footer className="flex gap-11">
          <button
            type="button"
            className="text-caption-caption4 text-foreground-foreground-secondary-lighter flex items-center gap-5"
            aria-label={`좋아요 ${likes}개`}
          >
            <SurfIcon name="Heart" size="s" aria-hidden="true" />
            <span aria-hidden="true">{likes}</span>
          </button>

          <button
            type="button"
            className="text-caption-caption4 text-foreground-foreground-secondary-lighter flex items-center gap-5"
            aria-label="답글 달기"
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
