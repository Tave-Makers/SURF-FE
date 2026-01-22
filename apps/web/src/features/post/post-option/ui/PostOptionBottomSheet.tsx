import { SurfIcon } from '@surf/ui/icon';
import { Sheet, SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    postOption: Omit<PostOptionBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type PostOptionBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  isMine: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
};

export const PostOptionBottomSheet = ({
  isOpen,
  onClose,
  isMine,
  onEdit,
  onDelete,
  onReport,
}: PostOptionBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet>
            <div className="flex w-full flex-col">
              {isMine ? (
                <>
                  {/* 수정하기 */}
                  <SheetItem
                    title="수정하기"
                    node={<SurfIcon name="EditSolid" />}
                    onClick={() => {
                      onEdit();
                      onClose();
                    }}
                  />

                  {/* 삭제하기 */}
                  <SheetItem
                    title="삭제하기"
                    textColor="danger"
                    onClick={() => {
                      onDelete();
                      onClose();
                    }}
                    node={
                      <SurfIcon name="TrashOneSolid" size="m" className="text-foreground-danger" />
                    }
                  />
                </>
              ) : (
                <>
                  {/* 신고하기 */}
                  <SheetItem
                    title="신고하기"
                    // TODO: 신고 아이콘 추가
                    // node={<SurfIcon name="" />}
                    onClick={() => {
                      onReport();
                      onClose();
                    }}
                  />
                </>
              )}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onClick={onClose} />
    </ModalSheet>
  );
};
