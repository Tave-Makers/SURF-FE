import { SelectField } from '@surf/ui/select-field';
import { Sheet } from '@surf/ui/sheet';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { MEMBER_ROLE_LABELS } from '@/entities/member/model/constants';
import { Member } from '@/entities/member/model/types';
import { MemberProfileSummary } from '@/entities/member/ui/MemberProfileSummary';
import { openExpelMemberConfirm } from '@/features/member/expel/model/openExpelMemberConfirm';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

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
  // TODO: memberId를 이용한 실제 멤버 조회 API 연동 필요
  const member: Member = {
    email: 'test@example.com',
    name: '홍길동',
    role: 'MEMBER',
    phoneNumber: '01012341234',
    status: 'approve',
    tracks: [
      {
        generation: 12,
        part: 'BACKEND',
      },
      {
        generation: 11,
        part: 'DESIGN',
      },
    ],
    activityScore: 0,
    careers: [],
    profileImageUrl: '',
    university: '000대',
    graduateSchool: '',
    id: 1,
    isActive: true,
    link: '',
    registeredAt: '25.01.12',
  };

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const openBottomSheet = useBottomSheetStore((state) => state.open);

  const handleExpel = () => {
    // TODO: 제명 API 호출 및 에러 처리 구현 필요
  };
  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container
        role="dialog"
        aria-label="멤버 관리"
        className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]"
      >
        <ModalSheet.Content>
          <Sheet
            primaryBtn={{
              label: '퇴출/제명하기',
              onClick: () =>
                openExpelMemberConfirm({
                  openAlert,
                  closeAlert,
                  onConfirm: handleExpel,
                }),
            }}
          >
            <div className="mb-13 flex w-full flex-col gap-11">
              <MemberProfileSummary member={member} />
              <SelectField
                size="l"
                aria-label="멤버 역할"
                selectedValue={MEMBER_ROLE_LABELS[member.role]}
                onClick={() =>
                  openBottomSheet({
                    type: 'changeRole',
                    props: {
                      memberId,
                      initialRole: member.role,
                    },
                  })
                }
              />
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
