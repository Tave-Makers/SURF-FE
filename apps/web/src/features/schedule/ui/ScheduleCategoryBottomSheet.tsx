import { Sheet } from '@surf/ui/sheet';
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
            <div className="rounded-4 flex flex-col gap-4 pt-16 pb-15">
              {SCHEDULE_CATEGORIES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className={`text-foreground-normal text-body-body6 flex w-full flex-1 items-center px-12 py-10 ${
                    selectedCategory === option.value
                      ? 'bg-background-secondary'
                      : 'hover:bg-background-secondary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }} />
    </ModalSheet>
  );
};
