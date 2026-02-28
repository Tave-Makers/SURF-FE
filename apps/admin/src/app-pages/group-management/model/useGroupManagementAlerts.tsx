import { useAlertStore } from '@surf/ui/store/alertStore';

type Params = {
  onSubmitEdit: () => void;
  onDeleteGroup: () => void;
  onLeavePage: () => void;
};

export const useGroupManagementAlerts = ({ onSubmitEdit, onDeleteGroup, onLeavePage }: Params) => {
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const openSaveEditAlert = () => {
    openAlert({
      state: 'default',
      title: '수정하시겠습니까?',
      infoText: '수정하기 버튼을 누를 시, 수정된 내용이 그룹 정보에 반영됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'primary',
          label: '저장하기',
          onClick: () => {
            closeAlert();
            onSubmitEdit();
          },
        },
      ],
    });
  };

  const openDeleteAlert = () => {
    openAlert({
      state: 'default',
      title: '삭제하시겠습니까?',
      infoText:
        '삭제하기 버튼을 누를 시, 그룹 리스트에서 해당 그룹 데이터가 영구적으로 삭제됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            closeAlert();
            onDeleteGroup();
          },
        },
      ],
    });
  };

  const openGoBackAlert = () => {
    openAlert({
      state: 'default',
      title: '나가시겠습니까?',
      infoText: '현재 페이지에서 이탈할 경우 변경한 내용이 저장되지 않습니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'danger',
          label: '나가기',
          onClick: () => {
            closeAlert();
            onLeavePage();
          },
        },
      ],
    });
  };

  const openPickLeaderAlert = () => {
    openAlert({
      state: 'error',
      title: '팀원을 먼저 선택해주세요',
      infoText: '팀장은 먼저 팀원을 선택한 뒤에 선택이 가능합니다.',
      actions: [{ type: 'text', variant: 'primary', label: '확인', onClick: closeAlert }],
    });
  };

  return {
    openSaveEditAlert,
    openDeleteAlert,
    openGoBackAlert,
    openPickLeaderAlert,
  };
};
