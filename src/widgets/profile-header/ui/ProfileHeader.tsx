'use client';

import { Avatar } from '@/shared/ui/avatar/Avatar';
import { InfoBadge } from '@/shared/ui/info-badge/InfoBadge';
import type { UserLevel } from '@/entities/user/model/types';
import { USER_LEVEL_BADGE } from '@/entities/user/ui/user-level/UserLevelBadges';

type Props = {
  name: string;
  level: UserLevel;
  chips: string[];
};

export function ProfileHeader({ name, level, chips }: Props) {
  const BadgeIcon = USER_LEVEL_BADGE[level];

  return (
    <div className="flex flex-row gap-[1rem] px-[1rem] py-[1.25rem]">
      <Avatar size="l" />
      <div className="flex flex-col gap-[0.44rem]">
        <div className="flex flex-row items-center gap-[0.38rem]">
          <div className="text-head-26-700--1 text-foreground-normal">{name}</div>
          <BadgeIcon width={20} height={20} />
        </div>
        <div className="flex flex-row flex-wrap gap-[0.25rem]">
          {chips.map((chip) => (
            <InfoBadge key={chip} text={chip} />
          ))}
        </div>
      </div>
    </div>
  );
}
