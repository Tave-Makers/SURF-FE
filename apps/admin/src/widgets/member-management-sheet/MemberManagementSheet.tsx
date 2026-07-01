import { Sheet } from '@surf/ui/sheet';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useEffect, useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { useMemberInfoQuery } from '@/entities/member/model/queries/useMemberInfoQuery';
import { MemberProfileSummary } from '@/entities/member/ui/MemberProfileSummary';
import { openDismissMemberConfirm } from '@/features/member/dismiss/model/openDismissMemberConfirm';
import { useDismissMemberMutation } from '@/features/member/dismiss/model/useDismissMemberMutation';
import { openExpelMemberConfirm } from '@/features/member/expel/model/openExpelMemberConfirm';
import { useExpelMemberMutation } from '@/features/member/expel/model/useExpelMemberMutation';
import { MemberRoleChangeField } from '@/features/member/role-change/ui/MemberRoleChangeField';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    member: Omit<MemberManagementSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type MemberManagementSheetProps = {
  /** 바텀시트 열림 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 조회할 회원 ID */
  memberId: number;
};

export const MemberManagementSheet = ({
  isOpen,
  onClose,
  memberId,
}: MemberManagementSheetProps) => {
  const { data: member } = useMemberInfoQuery(memberId);

  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const { mutate: dismissMember, isPending: isDismissPending } = useDismissMemberMutation();
  const { mutate: expelMember, isPending: isExpelPending } = useExpelMemberMutation();

  useEffect(() => {
    if (!isOpen) {
      setIsChangeRoleOpen(false);
    }
  }, [isOpen]);

  const handleDismiss = () => {
    dismissMember(
      { memberIds: [memberId] },
      {
        onSuccess: onClose,
      },
    );
  };

  const handleExpel = () => {
    expelMember(
      { memberIds: [memberId] },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose} disableDrag={isChangeRoleOpen}>
      <ModalSheet.Container
        role="dialog"
        aria-label="멤버 관리"
        className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]"
      >
        <ModalSheet.Content>
          <Sheet
            primaryBtn={{
              label: '퇴출하기',
              disabled: isDismissPending || isExpelPending,
              onClick: () =>
                openExpelMemberConfirm({
                  openAlert,
                  closeAlert,
                  onConfirm: handleExpel,
                }),
            }}
            secondaryBtn={{
              label: '제명하기',

              disabled: isDismissPending || isExpelPending,
              onClick: () =>
                openDismissMemberConfirm({
                  openAlert,
                  closeAlert,
                  onConfirm: handleDismiss,
                }),
            }}
          >
            <div className="mb-13 flex w-full flex-col gap-11">
              <MemberProfileSummary member={member} />
              <MemberRoleChangeField
                memberId={memberId}
                role={member.role}
                isOpen={isChangeRoleOpen}
                onOpenChange={setIsChangeRoleOpen}
              />
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
