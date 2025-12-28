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
    <div className="flex flex-row gap-13 px-13 py-15">
      <Avatar size="l" />
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center gap-7">
          <div className="text-body-body2 text-foreground-normal">{name}</div>
          <BadgeIcon width={20} height={20} />
        </div>
        <div className="flex flex-row flex-wrap gap-5">
          {chips.map((chip, idx) => (
            <InfoBadge key={`${chip}-${idx}`} text={chip} />
          ))}
        </div>
      </div>
    </div>
  );
}
