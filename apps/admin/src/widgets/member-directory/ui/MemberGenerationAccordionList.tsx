import { Avatar } from '@surf/ui/avatar';
import { SurfIcon } from '@surf/ui/icon';
import { useMemberGenerationListQuery } from '../model/queries/useMemberGenerationListQuery';
import { RoleBadge } from '@/entities/member/ui/RoleBadge';
import { SelectableMemberCard } from '@/entities/member/ui/SelectableMemberCard';
import { MemberGenerationAccordion } from '@/features/member-by-generation/ui/MemberGenerationAccordion';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export interface MemberGenerationAccordionListProps {
  keyword: string;
}
export const MemberGenerationAccordionList = ({ keyword }: MemberGenerationAccordionListProps) => {
  //기수 목록 조회
  const { data: generations } = useMemberGenerationListQuery();

  const openBottomSheet = useBottomSheetStore((state) => state.open);

  const handleOpenMemberSheet = (memberId: number) => {
    openBottomSheet({
      type: 'member',
      props: {
        memberId,
      },
    });
  };

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
          renderItem={(m) => (
            <SelectableMemberCard
              name={m.name}
              tracks={m.tracks}
              checked={false}
              onToggle={() => {}}
              leftSlot={
                <div className="relative">
                  <Avatar src={m.profileImageUrl} size="m" />
                  {/**TODO: 퇴출/제명 상태에 따라 색 변경 필요  */}
                  <div
                    className={`bg-background-primary absolute -right-4 -bottom-4 h-10 w-10 rounded-full`}
                  />
                </div>
              }
              rightSlot={
                <>
                  <RoleBadge type={m.role} />
                  <button
                    type="button"
                    onClick={() => handleOpenMemberSheet(m.id)}
                    aria-label={`${m.name} 상세 보기`}
                  >
                    <SurfIcon name="ChevronRight" />
                  </button>
                </>
              }
            />
          )}
        />
      ))}
    </div>
  );
};
