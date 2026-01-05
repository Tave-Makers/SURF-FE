import { MenuTrigger } from './menu-trigger/MenuTrigger';
import { MenuDropDown } from './menu-dropdown/MenuDropDown';
import { MenuItem } from './menu-item/MenuItem';
import type { MenuItemProps } from '@/shared/ui/menu/menu-item/MenuItem';

/**
 * @param label - 메뉴 트리거에 표시될 라벨 텍스트
 * @param itemList - 메뉴 아이템 리스트
 * @param align - 정렬 방향
 * @param isOpen - 메뉴 열림 여부
 * @param onToggle - 메뉴 열림 상태 변경
 * @param onClose - 메뉴를 닫을 때 호출
 */

export interface MenuProps {
  label: string;
  itemList?: MenuItemProps[];
  align?: 'left' | 'right'; // 정렬 방향
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const Menu = ({
  label,
  itemList = [],
  align = 'left',
  isOpen,
  onToggle,
  onClose,
}: MenuProps) => {
  return (
    <div className="relative w-fit">
      <MenuTrigger label={label} isOpen={isOpen} onClick={onToggle} />
      {isOpen && (
        <div
          className={`absolute top-full z-10 mt-2 w-full min-w-max ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <MenuDropDown
            items={itemList}
            onItemClick={(item) => {
              item.onClick(); // 아이템 자체 액션 실행
              onClose(); // 클릭 시 메뉴 닫기
            }}
            renderItem={(item, onClick) => (
              <MenuItem
                id={item.id}
                label={item.label}
                onClick={onClick}
                isSelected={item.isSelected}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};
