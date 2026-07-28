import { Sheet, SheetItem } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { SCHEDULE_CATEGORIES } from '@/entities/schedule/model/constants';
import { ScheduleCategory } from '@/entities/schedule/model/types';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    scheduleCategory: Omit<ScheduleCategoryBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type ScheduleCategoryBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ScheduleCategory;
  onSelect: (category: ScheduleCategory) => void;
};

export const ScheduleCategoryBottomSheet = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelect,
}: ScheduleCategoryBottomSheetProps) => {
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
            <div className="flex flex-col gap-4">
              {SCHEDULE_CATEGORIES.map((option) => (
                <SheetItem
                  key={option.value}
                  title={option.label}
                  pressed={selectedCategory === option.value}
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                />
              ))}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }} />
    </ModalSheet>
  );
};
