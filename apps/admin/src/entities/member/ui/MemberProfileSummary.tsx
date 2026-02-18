import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import type { ComponentProps } from 'react';
import { PART_LABELS } from '../model/constants';
import type { MemberDetail as MemberDetailModel } from '../model/types';

const infoRow = 'text-caption-caption6 text-foreground-normal flex flex-row items-center gap-5';
type InfoIconName = ComponentProps<typeof SurfIcon>['name'];

type MemberProfileSummaryProps = { member: MemberDetailModel };

export const MemberProfileSummary = ({ member }: MemberProfileSummaryProps) => {
  const { name, tracks, email, phoneNumber, university, registeredAt, profileImageUrl } = member;
  const infoSchema: Array<{ key: string; icon: InfoIconName; value: string }> = [
    { key: 'email', icon: 'Envelope', value: email },
    { key: 'phoneNumber', icon: 'Telephone', value: phoneNumber },
    { key: 'university', icon: 'AcademicHat', value: university },
    { key: 'registeredAt', icon: 'Alarm', value: registeredAt },
  ];

  return (
    <div className="flex w-full flex-col gap-11">
      <div className="flex w-full flex-row justify-between gap-13">
        <div className="flex flex-col gap-[0.375rem]">
          <span className="text-body-body2">{name}</span>
          <div className="flex flex-row flex-wrap gap-7">
            {tracks.map((track, idx) => (
              <InfoBadge key={idx} text={`${track.generation}기 ${PART_LABELS[track.part]}`} />
            ))}
          </div>
        </div>
        <Avatar src={profileImageUrl} />
      </div>

      <div className="flex flex-col gap-8">
        {infoSchema.map(({ key, icon, value }) => (
          <div key={key} className={infoRow}>
            <SurfIcon name={icon} size="s" />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
