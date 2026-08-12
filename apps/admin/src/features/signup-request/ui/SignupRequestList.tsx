import { SurfIcon } from '@surf/ui/icon';
import { MemberStatusBadge } from '@/entities/member/ui/MemberStatusBadge';
import { SelectableMemberCard } from '@/entities/member/ui/SelectableMemberCard';
import { SignupRequestMember } from '@/entities/signup-request/model/types';
import CareerEmpty from '@/shared/assets/icons/career-empty.svg';

interface SignupRequestListProps {
  members: SignupRequestMember[];
  isSelectionEnabled: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (memberId: number) => void;
  onClickMore: (memberId: number) => void;
}

/**
 * 가입 신청 목록 프레젠테이션 컴포넌트
 *
 * members 배열을 받아서 SignupRequestItem으로 렌더링합니다.
 */
export const SignupRequestList = ({
  members,
  isSelectionEnabled,
  selectedIds,
  onToggleSelect,
  onClickMore,
}: SignupRequestListProps) => {
  if (members.length === 0) {
    return (
      <div className="flex min-h-full w-full items-center justify-center px-13 py-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <CareerEmpty />
          <p className="text-body-body8 text-foreground-tertiary">가입 신청 내역이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex w-full grow flex-col">
      {members.map((member) => (
        <SelectableMemberCard
          key={member.id}
          name={member.name}
          tracks={member.tracks}
          registeredAt={member.registeredAt}
          isSelectionEnabled={isSelectionEnabled}
          checked={selectedIds.has(member.id)}
          onToggle={() => onToggleSelect(member.id)}
          rightSlot={
            <>
              <MemberStatusBadge status={member.status} />
              <button
                type="button"
                onClick={() => {
                  onClickMore(member.id);
                }}
                aria-label={`${member.name} 상세 보기`}
              >
                <SurfIcon name="ChevronRight" />
              </button>
            </>
          }
        />
      ))}
    </div>
  );
};
