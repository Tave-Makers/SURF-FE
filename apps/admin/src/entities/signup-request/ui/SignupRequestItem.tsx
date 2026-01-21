import { Checkbox } from '@surf/ui/checkbox';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import { SignupRequestStatus } from '../model/types';
import { RequestStatusBadge } from './RequestStatusBadge';
import { PART_LABELS } from '@/entities/member/model/constants';
import { MemberTrack } from '@/entities/member/model/types';

interface SignupRequestItemProps {
  name: string;
  university: string;
  tracks: MemberTrack[];
  registeredAt: string;
  checked: boolean;
  status: SignupRequestStatus;
}
export const SignupRequestItem = ({
  name,
  tracks,
  registeredAt,
  status,
  checked,
}: SignupRequestItemProps) => {
  return (
    <div
      className={`border-border-secondary flex flex-row items-start gap-13 border-b px-14 py-11 ${
        checked ? 'bg-background-notification' : ''
      }`}
    >
      <Checkbox />

      <div className="flex w-full grow flex-col items-start gap-5 overflow-hidden">
        <h3 className="text-body-body6 text-foreground-normal">{name}</h3>
        <div className="flex flex-row gap-5">
          {tracks.map((track, idx) => (
            <InfoBadge key={idx} text={`${track.generation}기 ${PART_LABELS[track.part]}`} />
          ))}
        </div>

        <span className="text-body-body11 text-foreground-secondary">
          <time dateTime={registeredAt} aria-label={`요청 시간  ${registeredAt}`}>
            {registeredAt}
          </time>
        </span>
      </div>
      <div className="mt-7 flex flex-row gap-8">
        <RequestStatusBadge status={status} />
        <SurfIcon name="ChevronRight" />
      </div>
    </div>
  );
};
