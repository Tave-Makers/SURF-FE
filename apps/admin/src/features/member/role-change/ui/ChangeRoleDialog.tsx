import { SolidButton } from '@surf/ui/button';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { Wheel } from '@surf/ui/wheel-picker';
import { useCallback, useEffect, useState } from 'react';
import { openChangeMemberRoleConfirm } from '../model/openChangeMemberRoleConfirm';
import { useUpdateMemberRoleMutation } from '../model/useUpdateMemberRoleMutation';
import { MEMBER_ROLE_LABELS } from '@/entities/member/model/constants';
import type { MemberRole } from '@/entities/member/model/types';

export interface ChangeRoleDialogProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  memberId: number;
  initialRole: MemberRole;
}

const MEMBER_ROLE_OPTIONS: readonly MemberRole[] = ['MEMBER', 'MANAGER', 'PRESIDENT', 'ADMIN'];
const MEMBER_ROLE_INDEX: Record<MemberRole, number> = {
  MEMBER: 0,
  MANAGER: 1,
  PRESIDENT: 2,
  ADMIN: 3,
};

export const ChangeRoleDialog = ({
  isOpen,
  onClose,
  memberId,
  initialRole,
}: ChangeRoleDialogProps) => {
  const initialRoleIndex = MEMBER_ROLE_INDEX[initialRole];

  const [selectedIdx, setSelectedIdx] = useState(initialRoleIndex);

  const { mutate, isPending } = useUpdateMemberRoleMutation();

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIdx(initialRoleIndex);
  }, [isOpen, initialRoleIndex]);

  const selectedRole = MEMBER_ROLE_OPTIONS[selectedIdx] ?? MEMBER_ROLE_OPTIONS[0];
  const hasRoleChanged = selectedRole !== initialRole;

  const setRoleLabel = useCallback((_relative: number, absolute: number): string => {
    const role = MEMBER_ROLE_OPTIONS[absolute];
    return role ? MEMBER_ROLE_LABELS[role] : '';
  }, []);

  const handleChangeRole = () => {
    if (isPending || !hasRoleChanged) return;

    mutate(
      { memberId, role: selectedRole },
      {
        onSuccess: () => {
          showToast('회원 등급이 변경되었습니다.');
          onClose();
        },
        onError: (error) => {
          showToast(error.message);
        },
      },
    );
  };
  const handleOpenConfirm = () => {
    openChangeMemberRoleConfirm({
      openAlert,
      closeAlert,
      role: selectedRole,
      onConfirm: handleChangeRole,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 w-full bg-black/60" aria-hidden />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="멤버 역할 변경"
        className="bg-background-normal-lighter rounded-4 relative z-10 flex w-68.75 flex-col gap-14 p-15"
      >
        <div className="relative flex h-44 w-full">
          <div className="bg-background-secondary pointer-events-none absolute top-1/2 left-1/2 z-1 h-6.25 w-full -translate-x-1/2 -translate-y-1/2 rounded-sm" />
          <div className="z-2 w-full">
            <Wheel
              value={selectedIdx}
              length={MEMBER_ROLE_OPTIONS.length}
              width={170}
              loop={false}
              setValue={setRoleLabel}
              onChange={setSelectedIdx}
              disableHighlight
            />
          </div>
        </div>

        <div className="flex w-full flex-row gap-8">
          <SolidButton size="l" variant="secondary" onClick={onClose}>
            취소하기
          </SolidButton>
          <SolidButton
            size="l"
            variant="primary"
            onClick={handleOpenConfirm}
            isDisabled={!hasRoleChanged || isPending}
          >
            선택하기
          </SolidButton>
        </div>
      </section>
    </div>
  );
};
