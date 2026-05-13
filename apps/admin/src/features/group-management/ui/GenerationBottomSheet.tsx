import { Sheet } from '@surf/ui/sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    generation: Omit<GenerationBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type GenerationBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  maxGeneration: number;
  selectedGeneration: number;
  onSelect: (generation: number) => void;
};

export const GenerationBottomSheet = ({
  isOpen,
  onClose,
  maxGeneration,
  selectedGeneration,
  onSelect,
}: GenerationBottomSheetProps) => {
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
              {Array.from({ length: maxGeneration }).map((_, idx) => {
                const generation = maxGeneration - idx;
                return (
                  <button
                    key={generation}
                    type="button"
                    onClick={() => onSelect(generation)}
                    className={`text-body-body6 text-foreground-normal rounded-md px-12 py-10 text-left transition-colors ${
                      selectedGeneration === generation
                        ? 'bg-background-secondary font-semibold'
                        : 'hover:bg-background-secondary'
                    }`}
                  >
                    {generation}기
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
