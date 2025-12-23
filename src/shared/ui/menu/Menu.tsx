import { useState } from 'react';
import { MenuTrigger } from './menu-trigger/MenuTrigger';
import { MenuDropDown } from './menu-dropdown/MenuDropDown';
import { MenuItem } from './menu-item/MenuItem';
import type { MenuItemProps } from '@/shared/ui/menu/menu-item/MenuItem';

/**
 * @param label - 메뉴 트리거에 표시될 라벨 텍스트
 * @param itemList - 메뉴 아이템 리스트
 */

export interface MenuProps {
  label: string;
  itemList?: MenuItemProps[];
}

export const Menu = ({ label, itemList = [] }: MenuProps) => {
  const [menuLabel, setMenuLabel] = useState(label);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="relative w-fit">
      <MenuTrigger label={menuLabel} isOpen={isMenuOpen} onClick={toggleMenu} />
      {isMenuOpen && (
        <div className="absolute top-full left-0 z-10 mt-2 w-full min-w-max">
          <MenuDropDown
            items={itemList}
            onItemClick={(item) => {
              setMenuLabel(item.label); // 메뉴 라벨 사용자 선택 라벨로 업데이트
              item.onClick(); // 아이템 자체 액션 실행
              closeMenu(); // 클릭 시 메뉴 닫기
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
