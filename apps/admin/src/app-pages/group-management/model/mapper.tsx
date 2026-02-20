import { SolidButton } from '@surf/ui/button';
import { HeaderProps, HeaderMode } from '@surf/ui/header';
import type React from 'react';
import { GroupManagementMode } from '@/widgets/group-management/model/types';

interface MapModeToHeaderProps {
  mode: GroupManagementMode;
  onClickEdit?: () => void;
}

export const mapModeToHeaderProps = ({ mode, onClickEdit }: MapModeToHeaderProps): HeaderProps => {
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

interface mapModeToStickyButtonProps {
  mode: GroupManagementMode;
  onClick: () => void;
  isDisabled: boolean;
}

export const mapModeToStickyButton = ({
  mode,
  onClick,
  isDisabled,
}: mapModeToStickyButtonProps): React.ReactNode | null => {
  switch (mode) {
    case 'create':
      return (
        <SolidButton size="l" variant="primary" isDisabled={isDisabled} onClick={onClick}>
          생성하기
        </SolidButton>
      );
    case 'edit':
      return (
        <SolidButton size="l" variant="primary" isDisabled={isDisabled} onClick={onClick}>
          수정하기
        </SolidButton>
      );
    case 'view':
    default:
      return null;
  }
};
