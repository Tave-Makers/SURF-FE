import { useState } from 'react';
import { MenuTrigger, MenuDropDown, MenuItem } from '@/shared/ui/menu';
import type { MenuItemProps } from '@/shared/ui/menu/menu-item/MenuItem';

interface MenuProps {
  label: string;
  itemList?: MenuItemProps[];
}

export const Menu = ({ label, itemList = [] }: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="relative w-fit">
      <MenuTrigger label={label} isOpen={isMenuOpen} onClick={toggleMenu} />
      {isMenuOpen && (
        <div className="absolute top-full left-0 z-10 mt-2 w-full min-w-max">
          <MenuDropDown
            items={itemList}
            onItemClick={(item) => {
              item.onClick(); // 아이템 자체 액션 실행
              closeMenu(); // 클릭 시 메뉴 닫기
            }}
            renderItem={(item) => (
              <MenuItem
                id={item.id}
                label={item.label}
                onClick={item.onClick}
                isSelected={item.isSelected}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};
