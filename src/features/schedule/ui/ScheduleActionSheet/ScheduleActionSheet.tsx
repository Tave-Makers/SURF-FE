'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Alert } from '@/shared/ui/alert/Alert';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { useDeleteSchedule } from '@/features/schedule/delete/model/useDelSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';

type ScheduleActionSheetProps = {
  scheduleId: string | number;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: () => void;
};

/**
 * 일정 수정/삭제 액션을 보여주는 바텀 시트 컴포넌트
 */
export function ScheduleActionSheet({
  scheduleId,
  isOpen,
  onClose,
  onDeleteSuccess,
}: ScheduleActionSheetProps) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const scheduleIdNum = typeof scheduleId === 'string' ? parseInt(scheduleId, 10) : scheduleId;

  // 삭제 훅 사용
  const deleteScheduleMutation = useDeleteSchedule();

  // 수정 훅 사용
  const editScheduleMutation = useEditSchedule();

  const handleEditClick = () => {
    // 수정 폼 페이지로 이동
    onClose();
    router.push(`/home/calendar/schedule/${scheduleId}/edit`);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteAlert(false);
    deleteScheduleMutation.mutate(scheduleIdNum, {
      onSuccess: () => {
        onDeleteSuccess?.();
        onClose();
      },
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalSheet isOpen={isOpen} onClose={onClose} className="mx-auto flex w-full sm:w-[360px]">
        <ModalSheet.Container>
          <ModalSheet.Header />
          <ModalSheet.Content>
            <Sheet>
              <div>
                {/* 수정하기 버튼 */}
                <button
                  onClick={handleEditClick}
                  disabled={editScheduleMutation.isPending}
                  className="flex w-full items-center gap-8 self-stretch px-12 py-10"
                >
                  <SurfIcon size="m" name="Edit" className="fill-foreground-normal-lighter" />
                  <span className="text-body-body5 text-foreground-normal">수정하기</span>
                </button>

                {/* 삭제하기 버튼 */}
                <button
                  onClick={handleDeleteClick}
                  disabled={deleteScheduleMutation.isPending}
                  className="flex w-full items-center gap-8 self-stretch px-12 py-10"
                >
                  <SurfIcon
                    size="m"
                    name="Trash"
                    className="fill-foreground-danger text-foreground-danger"
                  />
                  <span className="text-body-body5 text-foreground-danger-darker">삭제하기</span>
                </button>
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onClick={onClose} className="bg-black/70" />
      </ModalSheet>

      {createPortal(
        <div className="pointer-events-none fixed inset-0 z-9999 flex items-center justify-center">
          <div className="pointer-events-auto">
            <Alert
              state="default"
              title="작성된 일정이 삭제됩니다."
              infoText="삭제하기를 누를 경우에 해당 일정이 삭제됩니다."
              isOpen={showDeleteAlert}
              onClose={() => setShowDeleteAlert(false)}
              actions={[
                {
                  type: 'solid',
                  variant: 'secondary',
                  label: '취소',
                  onClick: () => setShowDeleteAlert(false),
                },
                {
                  type: 'solid',
                  variant: 'danger',
                  label: '삭제',
                  onClick: handleDeleteConfirm,
                  isDisabled: deleteScheduleMutation.isPending,
                },
              ]}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
