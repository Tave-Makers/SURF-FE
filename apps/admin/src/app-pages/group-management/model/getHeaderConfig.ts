import { HeaderProps, HeaderMode } from '@surf/ui/header';
import { GroupManagementMode } from '@/widgets/group-management/model/types';

interface Params {
  mode: GroupManagementMode;
  onClickEdit?: () => void;
}

export const getHeaderConfig = ({ mode, onClickEdit }: Params): HeaderProps => {
  switch (mode) {
    case 'create':
      return {
        mode: HeaderMode.Default,
        title: '신규 그룹 생성',
        hasLeftIcon: true,
      };

    case 'edit':
      return {
        mode: HeaderMode.Default,
        title: '그룹 정보 수정',
        hasLeftIcon: true,
      };

    case 'view':
    default:
      return {
        mode: HeaderMode.TextBtn,
        title: '그룹 상세 조회',
        text: '수정',
        btnVariant: 'primary',
        onClickTextBtn: onClickEdit,
        hasLeftIcon: true,
      };
  }
};
