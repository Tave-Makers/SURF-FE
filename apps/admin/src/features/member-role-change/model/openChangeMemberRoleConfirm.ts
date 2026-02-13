import { MemberRole } from '@/entities/member/model/types';
import { AlertPayload } from '@surf/ui/store/alertStore';

export function openChangeMemberRoleConfirm({
  openAlert,
  closeAlert,
  role,
  onConfirm,
}: {
  openAlert: (args: AlertPayload) => void;
  closeAlert: () => void;
  role: MemberRole;
  onConfirm: () => void;
}) {
  const title =
    role === 'PRESIDENT'
      ? '해당 회원을 Presidnet 등급으로 변경하시겠습니까?'
      : '회원의 등급을 변경하시겠습니까?';
  const infoText =
    role === 'PRESIDENT'
      ? '승인하기 버튼을 누를 시, 해당 회원의 등급이 President로 변경되며 기존 President 등급의 경우 Manager로 변경됩니다.'
      : '승인 버튼을 누를 시, 해당 인원의 등급이 변경됩니다.';

  openAlert({
    state: 'default',
    title,
    infoText,
    actions: [
      {
        type: 'solid',
        variant: 'secondary',
        label: '취소',
        onClick: closeAlert,
      },
      {
        type: 'solid',
        variant: 'primary',
        label: '승인하기',
        onClick: onConfirm,
      },
    ],
  });
}
