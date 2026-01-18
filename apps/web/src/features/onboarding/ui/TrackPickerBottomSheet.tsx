import { SolidButton } from '@surf/ui/button';
import { Sheet } from '@surf/ui/sheet';
import { WheelPicker } from '@surf/ui/wheel-picker';
import { useState, useCallback } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { TrackPart } from '@/entities/user/model/types';
import { mapToApiTrack } from '@/features/onboarding/lib/trackMapper';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    trackPicker: Omit<TrackPickerBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type TrackPickerBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (track: { generation: number; part: TrackPart }) => void;
};

export const TrackPickerBottomSheet = ({
  isOpen,
  onClose,
  onSelect,
}: TrackPickerBottomSheetProps) => {
  const [tempTrack, setTempTrack] = useState<{ generation: number; part: TrackPart } | null>(null);

  const handlePickerChange = useCallback(({ period, part }: { period: string; part: string }) => {
    try {
      const track = mapToApiTrack(period, part);

      setTempTrack((prev) => {
        if (prev?.generation === track.generation && prev?.part === track.part) {
          return prev;
        }
        return track;
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSelect = () => {
    if (tempTrack) {
      onSelect(tempTrack);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalSheet isOpen={isOpen} onClose={onClose}>
      <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <ModalSheet.Content>
          <Sheet>
            <div className="flex flex-col gap-[1.25rem]">
              <WheelPicker initPeriodIdx={0} initPartIdx={0} onChange={handlePickerChange} />
              <SolidButton type="button" size="l" variant="primary" onClick={handleSelect}>
                선택하기
              </SolidButton>
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
