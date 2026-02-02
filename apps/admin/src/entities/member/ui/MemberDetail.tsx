import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import { PART_LABELS } from '../model/constants';
import { MemberBase } from '../model/types';

const infoRow = 'text-caption-caption6 text-foreground-normal flex flex-row items-center gap-5';

type MemberDetailProps = { member: MemberBase };

export const MemberDetail = ({ member }: MemberDetailProps) => {
  const { tracks, email, phoneNumber, university, registeredAt } = member;
  return (
    <div className="flex w-full flex-col gap-11">
      <div className="flex w-full flex-row gap-13">
        <div className="flex grow flex-col gap-[0.375rem]">
          <span className="text-body-body2">테이비</span>
          {tracks.map((track, idx) => (
            <InfoBadge key={idx} text={`${track.generation}기 ${PART_LABELS[track.part]}`} />
          ))}
        </div>
        <Avatar />
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
