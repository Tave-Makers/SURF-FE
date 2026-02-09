import { SolidButton } from '@surf/ui/button';
import { Sheet } from '@surf/ui/sheet';
import { Suspense } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { useSignupStatusActions } from '../model/useSignupStatusActions';
import { useMemberInfoQuery } from '@/entities/member/model/queries/useMemberInfoQuery';
import { MemberDetail } from '@/entities/member/ui/MemberDetail';
import { MemberStatusBadge } from '@/entities/member/ui/MemberStatusBadge';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    signup: Omit<SignupRequestBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type SignupRequestBottomSheetProps = {
  /** 바텀시트 열림 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 조회할 회원 ID */
  memberId: number;
  showAction?: boolean;
};

/**
 * 가입 신청 회원 정보를 표시하는 바텀시트 컴포넌트
 * @description 회원 상세 정보를 조회하고, 대기 상태인 경우 승인/거절 기능을 제공합니다.
 */
export const SignupRequestBottomSheet = ({
  isOpen,
  onClose,
  memberId,
  showAction = true,
}: SignupRequestBottomSheetProps) => {
  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet title="회원 정보">
            <ErrorBoundary
              fallback={
                <div className="text-body-body6 text-foreground-secondary">
                  회원 정보를 불러오지 못했습니다.
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="text-body-body6 text-foreground-secondary">로딩중...</div>
                }
              >
                <MemberInfoContent memberId={memberId} showAction={showAction} onClose={onClose} />
              </Suspense>
            </ErrorBoundary>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
    </ModalSheet>
  );
};

/**
 * 회원 정보 및 승인/거절 액션을 표시하는 내부 컴포넌트
 */
const MemberInfoContent = ({
  memberId,
  showAction,
  onClose,
}: {
  memberId: number;
  showAction: boolean;
  onClose: () => void;
}) => {
  const { data: member } = useMemberInfoQuery(memberId);

  const { openApproveAlert, openRejectAlert, isPending } = useSignupStatusActions({
    memberIds: [memberId],
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <>
      <div className="flex size-full flex-col gap-[0.375rem] py-13">
        <MemberStatusBadge status={member.status} />
        <MemberDetail member={member} />
      </div>
      {member.status === 'waiting' && showAction && (
        <div className="mt-13 flex w-full flex-row gap-13">
          <SolidButton size="l" variant="danger" isDisabled={isPending} onClick={openRejectAlert}>
            거절하기
          </SolidButton>
          <SolidButton size="l" variant="primary" isDisabled={isPending} onClick={openApproveAlert}>
            승인하기
          </SolidButton>
        </div>
      )}
    </>
  );
};
