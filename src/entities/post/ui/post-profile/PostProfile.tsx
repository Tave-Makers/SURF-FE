import { Avatar } from '@/shared/ui/avatar/Avatar';

type PostProfileProps = {
  memberId: number | null;
  profileImgUrl?: string;
  nickname: string;
  date: string;
  time: string;
  viewCount: number;
};

export function PostProfile({
  memberId,
  profileImgUrl,
  nickname,
  date,
  time,
  viewCount,
}: PostProfileProps) {
  const isClickable = memberId !== null;
  return (
    <section className="flex items-center gap-10" aria-label={`${nickname}님의 작성 게시글 정보`}>
      {/* TODO: 프로필 이미지 클릭 시 사용자 프로필 페이지로 이동 */}
      <Avatar
        src={profileImgUrl}
        size="m"
        alt={`${nickname}의 프로필 이미지`}
        className={isClickable ? 'cursor-pointer' : 'cursor-default'}
        onClick={isClickable ? () => {} : undefined}
      />
      <div className="flex flex-col items-start justify-center py-3">
        {/* TODO: 닉네임 클릭 시 사용자 프로필 페이지로 이동 */}
        {isClickable ? (
          <button
            type="button"
            onClick={() => {}}
            className="text-body-body6 text-foreground-normal"
          >
            {nickname}
          </button>
        ) : (
          <strong className="text-body-body6 text-foreground-normal">{nickname}</strong>
        )}
        <div className="text-foreground-normal-lighter text-caption-caption4 flex items-center gap-7 pt-3">
          <time dateTime={date} aria-label={`작성일 ${date}`}>
            {date}
          </time>
          <time aria-label={`작성 시간 ${time}`}>{time}</time>
          <div className="flex gap-2" aria-label={`조회수 ${viewCount}`}>
            <span>조회</span>
            <span>{viewCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
