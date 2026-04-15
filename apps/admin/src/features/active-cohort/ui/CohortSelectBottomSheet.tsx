import { Sheet } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    cohort: Omit<CohortSelectBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type CohortSelectBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  maxCohort: number;
  selectedCohort: number | null;
  onSelect: (cohort: number) => void;
};

export const CohortSelectBottomSheet = ({
  isOpen,
  onClose,
  maxCohort,
  selectedCohort,
  onSelect,
}: CohortSelectBottomSheetProps) => {
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
              {Array.from({ length: maxCohort }).map((_, idx) => {
                const cohort = maxCohort - idx;
                const isSelected = selectedCohort === cohort;

                return (
                  <button
                    key={cohort}
                    type="button"
                    onClick={() => onSelect(cohort)}
                    className={`text-body-body6 text-foreground-normal rounded-md px-12 py-10 text-left transition-colors ${
                      isSelected ? 'bg-background-secondary font-semibold' : 'hover:bg-background-secondary'
                    }`}
                  >
                    {cohort}기
                  </button>
                );
              })}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
