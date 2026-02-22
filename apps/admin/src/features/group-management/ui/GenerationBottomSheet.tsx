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
        <ModalSheet.Header className="bg-background-normal-lighter rounded-t-4" />
        <ModalSheet.Content className="max-h-[35vh] overflow-y-auto">
          <div className="bg-background-normal-lighter flex flex-col gap-5 p-15">
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
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
