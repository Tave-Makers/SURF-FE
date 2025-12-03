import { Avatar } from '@/shared/ui/avatar/Avatar';

type PostProfileProps = {
  profileImgUrl?: string;
  nickname: string;
  date: string;
  time: string;
  viewCount: number;
};

export function PostProfile({ profileImgUrl, nickname, date, time, viewCount }: PostProfileProps) {
  return (
    <section className="flex items-center gap-10" aria-label={`${nickname}님의 작성 정보`}>
      <Avatar src={profileImgUrl} size="m" alt={`${nickname}의 프로필 이미지`} />
      <div className="flex flex-col items-start justify-center py-3">
        <strong className="text-body-body7 text-foreground-foreground-normal">{nickname}</strong>

        <div className="text-foreground-foreground-normal-lighter text-caption-caption4 flex items-center gap-7 pt-3">
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
