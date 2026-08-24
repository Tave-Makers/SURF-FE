import { SurfIcon } from '@surf/ui/icon';
import { Sheet, SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    memberOption: Omit<MemberOptionBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type MemberOptionBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 프로필(닉네임·프로필 사진·자기소개) 신고 화면으로 이동 */
  onReport: () => void;
  onBlock: () => void;
};

/** 다른 회원 프로필에서 여는 신고·차단 시트. 어떤 신고/차단을 하는지는 호출부가 정한다. */
export const MemberOptionBottomSheet = ({
  isOpen,
  onClose,
  onReport,
  onBlock,
}: MemberOptionBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet>
            <div className="flex w-full flex-col">
              <SheetItem
                title="신고하기"
                node={<SurfIcon name="Flag" />}
                onClick={() => {
                  onReport();
                  onClose();
                }}
              />

              <SheetItem
                title="차단하기"
                textColor="danger"
                node={<SurfIcon name="Ban" size="m" className="text-foreground-danger" />}
                onClick={() => {
                  onBlock();
                  onClose();
                }}
              />
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onClick={onClose} />
    </ModalSheet>
  );
};
