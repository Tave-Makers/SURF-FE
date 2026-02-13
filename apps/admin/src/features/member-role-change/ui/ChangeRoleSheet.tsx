import { SolidButton } from '@surf/ui/button';
import { Sheet } from '@surf/ui/sheet';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { Wheel } from '@surf/ui/wheel-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { openChangeMemberRoleConfirm } from '../model/openChangeMemberRoleConfirm';
import { MEMBER_ROLE_LABELS } from '@/entities/member/model/constants';
import type { MemberRole } from '@/entities/member/model/types';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    changeRole: Omit<ChangeRoleProps, 'isOpen' | 'onClose'>;
  }
}

export interface ChangeRoleProps {
  /** 바텀시트 열림 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  memberId: number;
  initialRole: MemberRole;
}

type ChangeableMemberRole = Exclude<MemberRole, 'ADMIN'>;

const MEMBER_ROLE_OPTIONS: readonly ChangeableMemberRole[] = ['PRESIDENT', 'MANAGER', 'MEMBER'];

export const ChangeRoleSheet = ({ isOpen, onClose, initialRole }: ChangeRoleProps) => {
  const initialRoleIndex = useMemo(() => {
    const idx = MEMBER_ROLE_OPTIONS.findIndex((role) => role === initialRole);
    return idx >= 0 ? idx : 0;
  }, [initialRole]);

  const [selectedIdx, setSelectedIdx] = useState(initialRoleIndex);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIdx(initialRoleIndex);
  }, [isOpen, initialRoleIndex]);

  const selectedRole = MEMBER_ROLE_OPTIONS[selectedIdx] ?? MEMBER_ROLE_OPTIONS[0];

  const setRoleLabel = useCallback((_relative: number, absolute: number): string => {
    const role = MEMBER_ROLE_OPTIONS[absolute];
    return role ? MEMBER_ROLE_LABELS[role] : '';
  }, []);

  const handleChangeRole = () => {
    //TODO: role 변경 API 호출 로직 추가
  };

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet>
            <div className="relative flex h-[176px] w-full">
              {/* 선택된 값 Highlight */}
              <div className="bg-background-secondary pointer-events-none absolute top-1/2 left-1/2 z-1 h-[25px] w-full -translate-x-1/2 -translate-y-1/2 rounded-[4px]" />
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
              <SolidButton
                size="l"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                취소하기
              </SolidButton>
              <SolidButton
                size="l"
                variant="primary"
                onClick={() =>
                  openChangeMemberRoleConfirm({
                    openAlert,
                    closeAlert,
                    role: selectedRole,
                    onConfirm: handleChangeRole,
                  })
                }
                isDisabled={initialRoleIndex === selectedIdx}
              >
                선택하기
              </SolidButton>
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
