import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import { PART_LABELS } from '../model/constants';
import { MemberDetail as MemberDetailType } from '../model/types';

const infoRow = 'text-caption-caption6 text-foreground-normal flex flex-row items-center gap-5';

type MemberDetailProps = { member: MemberDetailType };

export const MemberDetail = ({ member }: MemberDetailProps) => {
  const { name, tracks, email, phoneNumber, university, registeredAt, profileImageUrl } = member;
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
        <div className={infoRow}>
          <SurfIcon name="Envelope" size="s" />
          <span>{email}</span>
        </div>

        <div className={infoRow}>
          <SurfIcon name="Telephone" size="s" />
          <span>{phoneNumber}</span>
        </div>

        <div className={infoRow}>
          <SurfIcon name="AcademicHat" size="s" />
          <span>{university}</span>
        </div>
        <div className={infoRow}>
          <SurfIcon name="Alarm" size="s" />
          <span>{registeredAt}</span>
        </div>
      </div>
    </div>
  );
};
