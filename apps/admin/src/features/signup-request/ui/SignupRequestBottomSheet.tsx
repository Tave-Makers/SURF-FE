import { SolidButton } from '@surf/ui/button';
import { Sheet } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { MemberStatus } from '@/entities/member/model/types';
import { MemberDetail } from '@/entities/member/ui/MemberDetail';

import { StatusBadge } from '@/shared/ui/StatusBadge';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    signup: Omit<SignupRequestBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type SignupRequestBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  status: MemberStatus;
  //   likedUsers: LikedUser[];
  //   isLoading: boolean;
  //   isError: boolean;
};
export const SignupRequestBottomSheet = ({
  isOpen,
  onClose,
  status,
}: SignupRequestBottomSheetProps) => {
  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet title="회원 정보">
            <div className="flex size-full flex-col gap-[0.375rem] py-13">
              <StatusBadge variant="pink">대기</StatusBadge>
              <MemberDetail
                member={{
                  id: 1,
                  email: 'ej070961@gmail.com',
                  name: '이은지',
                  phoneNumber: '010-7189-0709',
                  profileImageUrl: '',
                  role: '',
                  tracks: [],
                  university: '서울과기대',
                  registeredAt: '',
                }}
              />
            </div>
            {status === 'waiting' && (
              <div className="mt-13 flex w-full flex-row gap-13">
                <SolidButton size="l" variant="danger">
                  거절하기
                </SolidButton>
                <SolidButton size="l" variant="primary">
                  승인하기
                </SolidButton>
              </div>
            )}
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
    </ModalSheet>
  );
};
