import { Sheet } from '@surf/ui/sheet';
import { SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    commentOption: Omit<CommentOptionBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type CommentOptionBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  isMine: boolean;
  onDelete: () => void;
  onReport: () => void;
};

export const CommentOptionBottomSheet = ({
  isOpen,
  onClose,
  isMine,
  onDelete,
  onReport,
}: CommentOptionBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet title="댓글 옵션">
            <div className="flex flex-col">
              {isMine ? (
                <SheetItem
                  title="삭제하기"
                  textColor="danger"
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                />
              ) : (
                <SheetItem
                  title="신고하기"
                  onClick={() => {
                    onReport();
                    onClose();
                  }}
                />
              )}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
