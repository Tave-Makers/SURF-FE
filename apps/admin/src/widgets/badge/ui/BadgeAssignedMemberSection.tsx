import { SolidButton } from '@surf/ui/button';
import { RemovableMemberCard } from '@/entities/member/ui/RemovableMemberCard';
import type { BadgeAwardedMember } from '@/features/badge/model/types';
import CareerEmpty from '@/shared/assets/icons/career-empty.svg';

type BadgeManageMode = 'detail' | 'edit';

type BadgeAssignedMemberSectionProps = {
  mode: BadgeManageMode;
  members: BadgeAwardedMember[];
  onRemoveMember?: (memberId: number) => void;
  onAddMember?: () => void;
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
  onAddMember,
}: BadgeAssignedMemberSectionProps) => {
  const isEdit = mode === 'edit';

  return (
    <section className="flex flex-col gap-12">
      <p className="text-title-title2 text-foreground-normal px-14">부여 인원</p>
      {members.length === 0 ? (
        // 부여된 멤버가 없을 때 보여주는 empty state
        <div className="flex w-full justify-center py-10">
          <div className="flex flex-col items-center gap-5">
            <CareerEmpty />
            <p className="text-body-body8 text-foreground-tertiary">부여된 인원이 없어요!</p>
          </div>
        </div>
      ) : (
        // 부여 멤버가 5명을 초과해도 섹션 높이가 커지지 않도록 내부 스크롤을 사용한다.
        <div className="max-h-70 w-full overflow-y-auto">
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
      {/* 수정 모드에서 배지 부여 페이지로 이동하는 액션 */}
      {isEdit && (
        <div className="px-14">
          <SolidButton size="s" variant="secondary" onClick={onAddMember}>
            추가하기
          </SolidButton>
        </div>
      )}
    </section>
  );
};
