import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import type { ScoreTargetMember } from '../model/types';

type ScoreTargetMemberListProps = {
  members: ScoreTargetMember[];
  selectedIds: Set<number>;
  onToggle: (memberId: number) => void;
};

export const ScoreTargetMemberList = ({
  members,
  selectedIds,
  onToggle,
}: ScoreTargetMemberListProps) => {
  return (
    <ul className="border-border-normal border-t">
      {members.map((member) => {
        const isSelected = selectedIds.has(member.id);
        const memberInfo =
          member.generation > 0 ? `${member.generation}기 ${member.partName}` : member.partName;

        return (
          <li key={member.id}>
            <label
              className={`flex min-h-[4.25rem] w-full cursor-pointer items-center gap-11 px-13 text-left ${
                isSelected ? 'bg-background-notification' : 'bg-background-normal'
              }`}
            >
              <span className="relative h-[1.25rem] w-[1.25rem] shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(member.id)}
                  className="bg-background-normal checked:bg-background-primary border-background-quinary rounded-2 peer h-full w-full cursor-pointer appearance-none border checked:border-none"
                />
                <span
                  aria-hidden
                  className="text-foreground-static-white pointer-events-none absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 peer-checked:opacity-100"
                >
                  <SurfIcon name="Check" size="s" />
                </span>
              </span>

              <Avatar src={member.profileImageUrl} size="m" alt="" />

              <span className="flex min-w-0 flex-col gap-5">
                <span className="text-body-body6 text-foreground-normal truncate">
                  {member.name}
                </span>
                <span className="flex gap-5">
                  {memberInfo && <InfoBadge text={memberInfo} />}
                  {member.trackCount > 1 && <InfoBadge text={`+${member.trackCount - 1}`} />}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};
