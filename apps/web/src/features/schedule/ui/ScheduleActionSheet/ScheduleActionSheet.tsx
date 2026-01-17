import { SurfIcon } from '@surf/ui/icon';
import { Sheet } from '@surf/ui/sheet';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { useDeleteSchedule } from '@/features/schedule/delete/model/useDelSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';
import { PAGE_ROUTES } from '@/shared/config/path';

type ScheduleActionSheetProps = {
  scheduleId: string | number;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: () => void;
};

/**
 * 일정 수정/삭제 액션을 보여주는 바텀 시트 컴포넌트
 */
export const ScheduleActionSheet = ({
  scheduleId,
  isOpen,
  onClose,
  onDeleteSuccess,
}: ScheduleActionSheetProps) => {
  const router = useRouter();
  const scheduleIdNum = typeof scheduleId === 'string' ? parseInt(scheduleId, 10) : scheduleId;
  const showToast = useToastStore((state) => state.show);
  const openAlert = useAlertStore((state) => state.open);
  const closeAlert = useAlertStore((state) => state.close);

  // 삭제 훅 사용
  const deleteScheduleMutation = useDeleteSchedule();

  // 수정 훅 사용
  const editScheduleMutation = useEditSchedule();

  const handleEditClick = () => {
    // 수정 폼 페이지로 이동
    onClose();
    router.push(PAGE_ROUTES.CALENDAR.SCHEDULE_EDIT(scheduleId));
  };

  const handleDeleteConfirm = () => {
    closeAlert();
    deleteScheduleMutation.mutate(scheduleIdNum, {
      onSuccess: () => {
        onDeleteSuccess?.();
        showToast('일정이 삭제되었습니다.');
        onClose();
      },
      onError: () => {
        showToast('일정 삭제에 실패했습니다.');
        onClose();
      },
    });
  };

  const handleDeleteClick = () => {
    openAlert({
      state: 'default',
      title: '작성된 일정이 삭제됩니다.',
      infoText: '삭제하기를 누를 경우에 해당 일정이 삭제됩니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제',
          onClick: handleDeleteConfirm,
          isDisabled: deleteScheduleMutation.isPending,
        },
      ],
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalSheet isOpen={isOpen} onClose={onClose} className="mx-auto flex w-full sm:w-[360px]">
        <ModalSheet.Container>
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
                  <span className="text-body-body6 text-foreground-normal">수정하기</span>
                </button>

                {/* 삭제하기 버튼 */}
                <button
                  onClick={handleDeleteClick}
                  disabled={deleteScheduleMutation.isPending}
                  className="flex w-full items-center gap-8 self-stretch px-12 py-10"
                >
                  <SurfIcon size="m" name="Trash" className="fill-foreground-danger" />
                  <span className="text-body-body6 text-foreground-danger-darker">삭제하기</span>
                </button>
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onClick={onClose} className="bg-effect-overlay-dim-normal" />
      </ModalSheet>
    </>
  );
};
