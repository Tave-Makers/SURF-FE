import { Avatar } from '@surf/ui/avatar';
import { RoleBadge } from '@/entities/member/ui/RoleBadge';
import { SelectableMemberCard } from '@/entities/member/ui/SelectableMemberCard';
import { MemberGenerationAccordion } from '@/features/member-by-generation/ui/MemberGenerationAccordion';

type BadgeAssignAccordionListProps = {
  generations: number[];
  keyword: string;
  selectedIds: Set<number>;
  assignedMemberIds: Set<number>;
  onToggle: (memberId: number) => void;
};

const ACCORDION_MAX_HEIGHT = '36vh';

/**
 * 배지 부여 화면에서 기수별 멤버 목록을 렌더링하는 아코디언 리스트.
 *
 * 이미 해당 배지를 부여받은 멤버는 renderItem에서 null을 반환해 목록에서 제외한다.
 */
export const BadgeAssignAccordionList = ({
  generations,
  keyword,
  selectedIds,
  assignedMemberIds,
  onToggle,
}: BadgeAssignAccordionListProps) => {
  if (generations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-12">
        <span className="text-body-body8 text-foreground-tertiary">아직 가입한 멤버가 없어요.</span>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
      {generations.map((generation) => (
        <MemberGenerationAccordion
          key={generation}
          generation={generation}
          label={`${generation}기`}
          keyword={keyword}
          contentMaxHeight={ACCORDION_MAX_HEIGHT}
          renderItem={(member) => {
            if (assignedMemberIds.has(member.id)) return null;

            return (
              <SelectableMemberCard
                name={member.name}
                tracks={member.tracks}
                isSelectionEnabled={true}
                checked={selectedIds.has(member.id)}
                onToggle={() => onToggle(member.id)}
                leftSlot={
                  <Avatar
                    size="s"
                    alt={`${member.name} 프로필 이미지`}
                    src={member.profileImageUrl}
                  />
                }
                rightSlot={<RoleBadge type={member.role} />}
              />
            );
          }}
        />
      ))}
    </div>
  );
};
