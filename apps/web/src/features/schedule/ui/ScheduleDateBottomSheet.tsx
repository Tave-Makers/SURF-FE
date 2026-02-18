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
  const [mountPicker, setMountPicker] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTempDate(initialDate || new Date());

    // 바텀시트 먼저 렌더 → 다음 프레임에 picker 마운트
    setMountPicker(false);
    const id = requestAnimationFrame(() => setMountPicker(true));
    return () => cancelAnimationFrame(id);
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
              {mountPicker ? (
                <DateTimePicker value={tempDate} onChange={setTempDate} mode="all" />
              ) : (
                // 레이아웃 점프 방지용 placeholder
                <div className="h-44" />
              )}
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.70)' }} />
    </ModalSheet>
  );
};
