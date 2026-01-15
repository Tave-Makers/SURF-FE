/**
 * @param label - 버튼에 표시될 라벨 텍스트
 * @param isOpen - 메뉴 리스트가 열려있는지 여부
 * @param onClick - 버튼 클릭 시 실행될 토글 함수
 */

import { SurfIcon } from '../../icon/SurfIcon';

export interface MenuTriggerProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
}

const baseStyle = 'flex h-18 items-center justify-center gap-5 px-8 rounded-3';

export const MenuTrigger = ({ label, isOpen, onClick }: MenuTriggerProps) => {
  return (
    <button type="button" className={baseStyle} onClick={onClick}>
      <div className="text-foreground-normal text-body-body9 flex">{label}</div>
      <div
        className={`flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      >
        <SurfIcon name="ChevronDown" size="s" />
      </div>
    </button>
  );
};
