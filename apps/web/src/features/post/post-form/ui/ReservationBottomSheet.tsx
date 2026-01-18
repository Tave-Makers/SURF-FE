import { Sheet } from '@surf/ui/sheet';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useEffect, useState } from 'react';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { DateTimePicker } from '@/entities/schedule/ui/DateTimePicker/DateTimePicker';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    reservation: Omit<ReservationBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}

export type ReservationBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  reserved: boolean;
  defaultDate: Date | null;
  onSave: (date: Date) => void;
  onRemove: () => void;
};

export const ReservationBottomSheet = ({
  isOpen,
  onClose,
  reserved,
  defaultDate,
  onSave,
  onRemove,
}: ReservationBottomSheetProps) => {
  const showToast = useToastStore((s) => s.show);
  // 모달 열릴 때 현재 예약 시간으로 초기화
  const [tempDate, setTempDate] = useState<Date>(defaultDate || new Date());

  useEffect(() => {
    if (isOpen && defaultDate) {
      setTempDate(defaultDate);
    }
  }, [isOpen, defaultDate]);

  const handleSave = () => {
    if (tempDate > new Date()) {
      onSave(tempDate);
      onClose();
    } else {
      showToast('현재 시간 이후로만 예약할 수 있습니다.');
    }
  };

  const handleRemove = () => {
    onRemove();
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
            title="게시글 예약 설정"
            description="해당 시간에 맞춰 게시글이 예약됩니다"
            primaryBtn={
              reserved
                ? {
                    label: '수정하기',
                    onClick: handleSave,
                  }
                : {
                    label: '예약하기',
                    onClick: handleSave,
                  }
            }
            secondaryBtn={
              reserved
                ? {
                    label: '예약 취소하기',
                    onClick: handleRemove,
                    variant: 'warning',
                  }
                : {
                    label: '취소하기',
                    onClick: onClose,
                  }
            }
          >
            <div className="py-15">
              <DateTimePicker mode="future" value={tempDate} onChange={setTempDate} />
            </div>
          </Sheet>
        </ModalSheet.Content>
      </ModalSheet.Container>
      <ModalSheet.Backdrop onTap={onClose} />
    </ModalSheet>
  );
};
