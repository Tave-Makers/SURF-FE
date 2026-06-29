import { Avatar } from '@surf/ui/avatar';
import { Checkbox } from '@surf/ui/checkbox';
import { InfoBadge } from '@surf/ui/info-badge';
import type { ActivityScoreMember } from '../model/types';

type ScoreTargetMemberListProps = {
  members: ActivityScoreMember[];
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
            <div
              role="checkbox"
              tabIndex={0}
              className={`flex min-h-[4.25rem] w-full items-center gap-11 px-13 text-left ${
                isSelected ? 'bg-background-notification' : 'bg-background-normal'
              }`}
              onClick={() => onToggle(member.id)}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  onToggle(member.id);
                }
              }}
              aria-checked={isSelected}
            >
              <span
                role="presentation"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                className="flex shrink-0"
              >
                <Checkbox
                  isChecked={isSelected}
                  onChange={(event) => {
                    event.stopPropagation();
                    onToggle(member.id);
                  }}
                  aria-label={`${member.name} 선택`}
                />
              </span>

              <Avatar src={member.profileImageUrl} size="m" alt={`${member.name} 프로필 이미지`} />

              <span className="flex min-w-0 flex-col gap-5">
                <span className="text-body-body6 text-foreground-normal truncate">
                  {member.name}
                </span>
                <span className="flex gap-5">
                  {memberInfo && <InfoBadge text={memberInfo} />}
                  {member.tracksCount > 1 && <InfoBadge text={`+${member.tracksCount - 1}`} />}
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
