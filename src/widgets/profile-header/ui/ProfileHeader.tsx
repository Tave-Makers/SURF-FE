'use client';

import { Avatar } from '@/shared/ui/avatar/Avatar';
import { InfoBadge } from '@/shared/ui/info-badge/InfoBadge';
import type { UserLevel } from '@/entities/user/model/types';
import { USER_LEVEL_BADGE } from '@/entities/user/ui/user-level/UserLevelBadges';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

const infoText = 'text-caption-caption6 text-foreground-normal';

type Props = {
  name: string;
  level: UserLevel;
  chips: string[];
};

export function ProfileHeader({ name, level, chips }: Props) {
  const BadgeIcon = USER_LEVEL_BADGE[level];

  return (
    <div className="flex flex-col gap-11 px-13 pt-13 pb-11">
      <div className="flex flex-row">
        <div className="flex flex-col gap-7">
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
        <Avatar size="l" />
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row items-center gap-4">
          <SurfIcon name="Envelope" size="s" />
          <span className="text-caption-caption2 text-foreground-secondary">한줄소개</span>
        </div>
        <span className="text-caption-caption4 text-foreground-quaternary">링크</span>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-center gap-4">
          <SurfIcon name="Envelope" size="s" />
          <span className={infoText}>이메일</span>
        </div>
        <div className="flex flex-row items-center gap-4">
          <SurfIcon name="Telephone" size="s" />
          <span className={infoText}>전화</span>
        </div>
        <div className="flex flex-row items-center gap-4">
          <SurfIcon name="AcademicHat" size="s" />
          <span className={infoText}>학교</span>
        </div>
      </div>
    </div>
  );
}
