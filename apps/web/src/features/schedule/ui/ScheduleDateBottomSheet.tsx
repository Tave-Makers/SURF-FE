import { Sheet } from '@surf/ui/sheet';
import { useState, useEffect } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    scheduleDate: Omit<ScheduleDateBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type ScheduleDateBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  initialDate: Date;
  onSave: (date: Date) => void;
};

export const ScheduleDateBottomSheet = ({
  isOpen,
  onClose,
  title,
  description,
  initialDate,
  onSave,
}: ScheduleDateBottomSheetProps) => {
  const [tempDate, setTempDate] = useState<Date>(initialDate || new Date());

  useEffect(() => {
    if (isOpen) {
      setTempDate(initialDate || new Date());
    }
  }, [isOpen, initialDate]);

  const handleSave = () => {
    onSave(tempDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]"
    >
      <ModalSheet.Container>
        <ModalSheet.Content>
          <Sheet
            title={title}
            description={description}
            primaryBtn={{
              label: '예약하기',
              onClick: handleSave,
            }}
            secondaryBtn={{
              label: '취소하기',
              onClick: onClose,
            }}
          >
            <div className="py-15">
              <DateTimePicker value={tempDate} onChange={setTempDate} mode="all" />
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }} />
    </ModalSheet>
  );
};
