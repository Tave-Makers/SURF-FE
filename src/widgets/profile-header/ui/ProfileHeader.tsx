'use client';

import Link from 'next/link';

import { Avatar } from '@/shared/ui/avatar/Avatar';
import { InfoBadge } from '@/shared/ui/info-badge/InfoBadge';
import { USER_LEVEL_BADGE } from '@/entities/user/ui/user-level/UserLevelBadges';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { kakaoImgNormalize } from '@/shared/lib/kakaoImgNormalize';
import type { UserProfile } from '@/entities/user/model/types';

const infoRow = 'text-caption-caption6 text-foreground-normal flex flex-row items-center gap-5';

interface Props {
  userProfile: UserProfile;
}

function nonEmptyText(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  return v.length > 0 ? v : null;
}

export function ProfileHeader({ userProfile }: Props) {
  const BadgeIcon = USER_LEVEL_BADGE[userProfile.level];
  const showBadge = userProfile.level !== 'member' && !!BadgeIcon;

  const profileImg = kakaoImgNormalize(userProfile.profileImgUrl);

  const introText = nonEmptyText(userProfile.selfIntroduction);
  const linkText = nonEmptyText(userProfile.link);
  const hasIntroOrLink = !!introText || !!linkText;

  const universityText = [
    nonEmptyText(userProfile.university),
    userProfile.graduateSchool ? `· ${userProfile.graduateSchool}` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="flex flex-col gap-11 px-13 pt-13 pb-11">
      <div className="flex flex-row items-end justify-between gap-8">
        <div className="flex flex-col gap-7">
          <div className="flex flex-row items-center gap-7">
            <div className="text-body-body2 text-foreground-normal">{userProfile.username}</div>
            {showBadge && <BadgeIcon width={20} height={20} />}
          </div>

          <div className="flex flex-row flex-wrap gap-5">
            {userProfile.chips.map((chip, idx) => (
              <InfoBadge key={`${chip}-${idx}`} text={chip} />
            ))}
          </div>
        </div>

        <Avatar size="l" src={profileImg} />
      </div>

      {hasIntroOrLink ? (
        <div className="flex flex-col gap-10">
          {introText ? (
            <span className="text-caption-caption2 text-foreground-secondary">{introText}</span>
          ) : null}

          {linkText ? (
            <div className="text-foreground-quaternary flex flex-row items-center gap-5">
              <SurfIcon name="Link" size="s" />
              <Link
                className="text-caption-caption4 truncate"
                href={linkText}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkText}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        <div className={infoRow}>
          <SurfIcon name="Envelope" size="s" />
          <span>{userProfile.email}</span>
        </div>

        {userProfile.phoneNumberPublic === true && nonEmptyText(userProfile.phoneNumber) ? (
          <div className={infoRow}>
            <SurfIcon name="Telephone" size="s" />
            <span>{userProfile.phoneNumber}</span>
          </div>
        ) : null}

        {universityText ? (
          <div className={infoRow}>
            <SurfIcon name="AcademicHat" size="s" />
            <span>{universityText}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
