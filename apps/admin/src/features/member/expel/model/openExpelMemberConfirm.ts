import { AlertPayload } from '@surf/ui/store/alertStore';

export function openExpelMemberConfirm({
  openAlert,
  closeAlert,
  onConfirm,
}: {
  openAlert: (args: AlertPayload) => void;
  closeAlert: () => void;
  onConfirm: () => void;
}) {
  openAlert({
    state: 'default',
    title: '퇴출/제명하시겠습니까?',
    infoText: '퇴출/제명 버튼을 누를 시 해당 멤버를 SURF에서 퇴출/제명합니다.',
    actions: [
      { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
      {
        type: 'solid',
        variant: 'danger',
        label: '퇴출/제명하기',
        onClick: () => {
          onConfirm();
          closeAlert();
        },
      },
    ],
  });
}
