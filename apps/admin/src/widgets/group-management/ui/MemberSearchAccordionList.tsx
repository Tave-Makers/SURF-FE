import { Avatar } from '@surf/ui/avatar';
import { SelectableMemberCard } from '@/entities/member/ui/SelectableMemberCard';
import { MemberGenerationAccordion } from '@/features/member-by-generation/ui/MemberGenerationAccordion';

export interface MemberSearchAccordionListProps {
  generations: number[];
  keyword: string;
  selectedIds: Set<number>;
  onToggle: (memberId: number) => void;
}
export const MemberSearchAccordionList = ({
  generations,
  keyword,
  selectedIds,
  onToggle,
}: MemberSearchAccordionListProps) => {
  if (generations.length === 0)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-12">
        <span className="text-body-body8 text-foreground-tertiary">아직 가입한 멤버가 없어요.</span>
      </div>
    );

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto">
      {generations.map((generation) => (
        <MemberGenerationAccordion
          key={generation}
          generation={generation}
          label={`${generation}기`}
          keyword={keyword}
          defaultOpen={true}
          renderItem={(m) => (
            <SelectableMemberCard
              name={m.name}
              tracks={m.tracks}
              isSelectionEnabled={true}
              checked={selectedIds.has(m.id)}
              onToggle={() => onToggle(m.id)}
              leftSlot={<Avatar size="s" alt={`${m.name} 프로필 이미지`} src={m.profileImageUrl} />}
            />
          )}
        />
      ))}
    </div>
  );
};
