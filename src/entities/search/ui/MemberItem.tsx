import { USER_LEVEL_BADGE } from '@/entities/user/ui/user-level/UserLevelBadges';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { InfoBadge } from '@/shared/ui/info-badge/InfoBadge';
import { MemberItemUser } from '../model/types';

export type MemberItemProps = {
  user: MemberItemUser;
};

export const MemberItem = ({ user }: MemberItemProps) => {
  const { name, bio, level, chips } = user;
  const BadgeIcon = USER_LEVEL_BADGE[level];

  return (
    <article className="flex w-full gap-11 p-12">
      {/* 프로필 이미지 */}
      <Avatar size="m" />

      <div className="flex flex-col gap-7">
        {/* 헤더: 이름 + 레벨 + 칩 */}
        <header className="flex gap-8">
          {/* 이름 + 권한 아이콘 */}
          <h3 className="text-foreground-normal text-body-body6 flex items-center gap-5">
            <span>{name}</span>
            <BadgeIcon className="h-[1.125rem] w-[1.125rem] shrink-0" />
          </h3>

          {/* 기수
          TODO: chip 여러 개일 시 마지막 칩 +N개 UI 처리 필요 */}
          <ul className="flex items-center gap-5">
            {chips.map((chip) => (
              <li key={chip}>
                <InfoBadge text={chip} />
              </li>
            ))}
          </ul>
        </header>

        {/* 한 줄 소개 */}
        <p className="text-foreground-normal text-caption-caption4">{bio ?? ''}</p>
      </div>
    </article>
  );
};
