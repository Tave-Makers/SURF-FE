import { Avatar } from '@surf/ui/avatar';
import { MemberGeneration } from '../model/types';
import { RoleBadge } from '@/entities/member/ui/RoleBadge';
import { SelectableMemberCard } from '@/entities/member/ui/SelectableMemberCard';
import { MemberGenerationAccordion } from '@/features/member-by-generation/ui/MemberGenerationAccordion';

export interface MemberGenerationAccordionListProps {
  generations: MemberGeneration[];
}
export const MemberGenerationAccordionList = ({
  generations,
}: MemberGenerationAccordionListProps) => {
  if (generations.length === 0)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-12">
        <span className="text-body-body8 text-foreground-tertiary">아직 가입한 멤버가 없어요.</span>
      </div>
    );

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto">
      {generations.map(({ generation, label }) => (
        <MemberGenerationAccordion
          key={generation}
          generation={generation}
          label={label}
          renderItem={(m) => (
            <SelectableMemberCard
              name={m.name}
              tracks={m.tracks}
              checked={false}
              onToggle={() => {}}
              leftSlot={<Avatar size="s" alt="테이비 프로필 이미지" src={m.profileImageUrl} />}
              rightSlot={<RoleBadge type={m.role} />}
            />
          )}
        />
      ))}
    </div>
  );
};
