import { ProfileImage } from '../profile-image/ProfileImage';

type PostProfileProps = {
  profileImgUrl?: string;
  nickname: string;
  date: string;
  time: string;
  viewCount: number;
};

export function PostProfile({ profileImgUrl, nickname, date, time, viewCount }: PostProfileProps) {
  return (
    <div className="flex items-center gap-10">
      <ProfileImage src={profileImgUrl} size="m" alt={`${nickname}의 프로필 이미지`} />
      <div className="flex flex-col items-start justify-center py-3">
        <div className="text-body-body7 text-foreground-foreground-normal">{nickname}</div>
        <div className="text-foreground-foreground-normal-lighter text-caption-caption4 flex items-center gap-7 pt-3">
          <div>{date}</div>
          <div>{time}</div>
          <div className="flex gap-[0.125rem]">
            <div>조회</div>
            <div>{viewCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
