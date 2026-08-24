import { Sheet, SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    memberBlock: Omit<MemberBlockBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type MemberBlockBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
};

export const MemberBlockBottomSheet = ({
  isOpen,
  onClose,
  onBlock,
}: MemberBlockBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet>
            <div className="flex w-full flex-col">
              <SheetItem
                title="차단하기"
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
