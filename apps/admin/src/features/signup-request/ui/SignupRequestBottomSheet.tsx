import { SolidButton } from '@surf/ui/button';
import { Sheet } from '@surf/ui/sheet';
import { Suspense } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { useMemberInfoQuery } from '@/entities/member/model/queries/useMemberInfoQuery';
import { MemberDetail } from '@/entities/member/ui/MemberDetail';
import { RequestStatusBadge } from '@/entities/signup-request/ui/RequestStatusBadge';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    signup: Omit<SignupRequestBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type SignupRequestBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
};
export const SignupRequestBottomSheet = ({
  isOpen,
  onClose,
  memberId,
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
                <MemberInfoContent memberId={memberId} />
              </Suspense>
            </ErrorBoundary>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
    </ModalSheet>
  );
};

const MemberInfoContent = ({ memberId }: { memberId: number }) => {
  const { data: member } = useMemberInfoQuery(memberId, {
    throwOnError: true,
  });

  if (!member) {
    return <div className="text-body-body6 text-foreground-secondary">회원 정보가 없습니다.</div>;
  }

  return (
    <>
      <div className="flex size-full flex-col gap-[0.375rem] py-13">
        <RequestStatusBadge status={member.status} />
        <MemberDetail member={member} />
      </div>
      {member.status === 'waiting' && (
        <div className="mt-13 flex w-full flex-row gap-13">
          <SolidButton size="l" variant="danger">
            거절하기
          </SolidButton>
          <SolidButton size="l" variant="primary">
            승인하기
          </SolidButton>
        </div>
      )}
    </>
  );
};
