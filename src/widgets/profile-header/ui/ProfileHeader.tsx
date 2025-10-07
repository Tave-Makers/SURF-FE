'use client';

import { ProfileImage } from '@/shared/ui/profile-image/ProfileImage';
import { Chip } from '@/shared/ui/chip/Chip';
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
      <ProfileImage size="l" />
      <div className="flex flex-col gap-[0.44rem]">
        <div className="flex flex-row items-center gap-[0.38rem]">
          <div className="text-head-26-700--1 text-foreground-normal">{name}</div>
          <BadgeIcon width={20} height={20} />
        </div>
        <div className="flex flex-row flex-wrap gap-[0.25rem]">
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
