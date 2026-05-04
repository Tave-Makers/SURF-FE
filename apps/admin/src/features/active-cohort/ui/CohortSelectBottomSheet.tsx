'use client';

import { SolidButton } from '@surf/ui/button';
import { Sheet } from '@surf/ui/sheet';
import { Wheel } from '@surf/ui/wheel-picker';
import { useCallback, useState } from 'react';
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
  const [selectedIdx, setSelectedIdx] = useState(
    selectedCohort !== null ? maxCohort - selectedCohort : 0,
  );

  const setCohortLabel = useCallback(
    (_relative: number, absolute: number) => `${maxCohort - absolute}기`,
    [maxCohort],
  );

  const handleSelect = () => {
    onSelect(maxCohort - selectedIdx);
    onClose();
  };

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Content>
          <Sheet>
            <div className="flex flex-col gap-12 py-15">
              <div className="relative flex h-44 w-full">
                <div className="bg-background-secondary pointer-events-none absolute top-1/2 left-1/2 z-1 h-6.25 w-full -translate-x-1/2 -translate-y-1/2 rounded-sm" />
                <div className="z-2 w-full">
                  <Wheel
                    value={selectedIdx}
                    length={maxCohort}
                    width={160}
                    loop={false}
                    setValue={setCohortLabel}
                    onChange={setSelectedIdx}
                    disableHighlight
                  />
                </div>
              </div>
              <div className="flex w-full flex-row gap-8">
                <SolidButton size="l" variant="secondary" onClick={onClose}>
                  취소하기
                </SolidButton>
                <SolidButton size="l" variant="primary" onClick={handleSelect}>
                  선택하기
                </SolidButton>
              </div>
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
