import { FieldGroup } from '@surf/ui/field-group';
import { RemovableMemberCard } from '@/entities/member/ui/RemovableMemberCard';
import type { BadgeAwardedMember } from '@/features/badge/model/types';
import CareerEmpty from '@/shared/assets/icons/career-empty.svg';

type BadgeManageMode = 'detail' | 'edit';

type BadgeAssignedMemberSectionProps = {
  mode: BadgeManageMode;
  members: BadgeAwardedMember[];
  onRemoveMember?: (memberId: number) => void;
};

/**
 * 배지 상세/수정 화면의 부여 인원 섹션.
 *
 * 부여된 멤버가 없으면 empty state를 표시하고,
 * 멤버가 있으면 최대 5명 기준 높이 안에서 내부 스크롤 목록으로 렌더링한다.
 */
export const BadgeAssignedMemberSection = ({
  mode,
  members,
  onRemoveMember,
}: BadgeAssignedMemberSectionProps) => {
  const isEdit = mode === 'edit';

  return (
    <FieldGroup title="부여 인원" className="px-14">
      {members.length === 0 ? (
        <div className="flex w-full justify-center py-10">
          <div className="flex flex-col items-center gap-5">
            <CareerEmpty />
            <p className="text-body-body8 text-foreground-tertiary">부여된 인원이 없어요!</p>
          </div>
        </div>
      ) : (
        <div className="max-h-[17.5rem] w-full overflow-y-auto">
          {members.map((member) => (
            <RemovableMemberCard
              key={member.id}
              id={member.id}
              name={member.name}
              profileImageUrl={member.profileImageUrl}
              tracks={member.tracks}
              isRemovalEnabled={isEdit}
              onRemoveMember={onRemoveMember ?? (() => {})}
            />
          ))}
        </div>
      )}
    </FieldGroup>
  );
};
