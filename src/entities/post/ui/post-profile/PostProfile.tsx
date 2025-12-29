import { Avatar } from '@/shared/ui/avatar/Avatar';
import { kakaoImgNormalize } from '@/shared/lib/kakaoImgNormalize';

type PostProfileProps = {
  profileImgUrl?: string;
  nickname: string;
  date: string;
  time: string;
  viewCount: number;
};

export function PostProfile({ profileImgUrl, nickname, date, time, viewCount }: PostProfileProps) {
  return (
    <section className="flex items-center gap-10" aria-label={`${nickname}님의 작성 게시글 정보`}>
      <Avatar src={kakaoImgNormalize(profileImgUrl)} size="m" alt={`${nickname}의 프로필 이미지`} />
      <div className="flex flex-col items-start justify-center py-3">
        <strong className="text-body-body6 text-foreground-normal">{nickname}</strong>

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
