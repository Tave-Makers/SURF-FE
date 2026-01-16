import { Checkbox } from '@surf/ui/dist/components/checkbox';
import { SurfIcon } from '@surf/ui/dist/components/icon';
import { InfoBadge } from '@surf/ui/dist/components/info-badge';
import { SignupRequestStatus } from '../model/types';
import { RequestStatusBadge } from './RequestStatusBadge';

interface SignupRequestItem {
  name: string;
  infoTags: string[];
  timestamp: string;
  isChecked: boolean;
  status: SignupRequestStatus;
}
export const SignupRequestItem = ({
  name,
  infoTags,
  timestamp,
  status,
  isChecked,
}: SignupRequestItem) => {
  return (
    <div
      className={`border-border-secondary flex flex-row items-start gap-13 border-b px-14 py-11 ${
        isChecked ? 'bg-background-notification' : ''
      }`}
    >
      <Checkbox />

      <div className="flex w-full grow flex-col items-start gap-5 overflow-hidden">
        <h3 className="text-body-body6 text-foreground-normal">{name}</h3>
        <div className="flex flex-row gap-5">
          <InfoBadge text={infoTags[0]} />
          {infoTags.length > 1 && <InfoBadge text={`+ ${infoTags.length - 1}`} />}
        </div>

        <span className="text-body-body11 text-foreground-secondary">
          <time dateTime={timestamp} aria-label={`요청 시간  ${timestamp}`}>
            {timestamp}
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
