import { Avatar } from '@surf/ui/avatar';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import type { MemberBase } from '@/entities/member/model/types';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    pickLeader: Omit<PickLeaderBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type PickLeaderBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  leader?: MemberBase;
  members: MemberBase[]; // 팀장 제외된 팀원 목록
  onSelect: (member: MemberBase) => void;
};

export const PickLeaderBottomSheet = ({
  isOpen,
  onClose,
  members,
  onSelect,
}: PickLeaderBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Header className="bg-background-normal-lighter rounded-t-4" />
        <ModalSheet.Content className="max-h-[45vh] overflow-y-auto">
          <div className="bg-background-normal-lighter flex flex-col p-15">
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => onSelect(member)}
                className="hover:bg-background-secondary flex items-center gap-10 rounded-md px-12 py-10 text-left transition-colors"
              >
                <Avatar size="xs" src={member.profileImageUrl} alt={`${member.name} 프로필`} />
                <span className="text-body-body6 text-foreground-normal">{member.name}</span>
              </button>
            ))}

            {members.length === 0 && (
              <div className="text-body-body6 text-foreground-normal px-12 py-20 text-left">
                선택할 수 있는 멤버가 없어요.
              </div>
            )}
          </div>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
