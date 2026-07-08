import { Sheet, SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { CONTENTS_TYPE_OPTIONS } from '@/shared/constants/contents';
import type { ContentsType } from '@/shared/types/contents';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    groupType: Omit<GroupTypeBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type GroupTypeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  groupType: ContentsType;
  onSelect: (groupType: ContentsType) => void;
};

export const GroupTypeBottomSheet = ({
  isOpen,
  onClose,
  groupType,
  onSelect,
}: GroupTypeBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Content>
          <Sheet>
            <div className="flex flex-col gap-5 py-15">
              {CONTENTS_TYPE_OPTIONS.map(({ value, label }) => (
                <SheetItem
                  key={value}
                  title={label}
                  pressed={groupType === value}
                  onClick={() => onSelect(value)}
                />
              ))}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
