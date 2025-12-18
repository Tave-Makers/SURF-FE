import type { ReactNode } from 'react';

/**
 * @param items - MenuDropDown 내의 아이템 리스트
 * @param renderItem - MenuDropDown 내의 각 아이템을 어떻게 렌더링할지 주입
 * @param onItemClick - MenuDropDown 내의 각 아이템 클릭 이벤트
 */

interface MenuDropDownProps<T extends { id: number }> {
  items: T[];
  renderItem: (item: T, onClick: () => void) => ReactNode;
  onItemClick: (item: T) => void;
}

export function MenuDropDown<T extends { id: number }>({
  items,
  renderItem,
  onItemClick,
}: MenuDropDownProps<T>) {
  return (
    <div className="rounded-3 shadow-raised bg-background-normal-lighter flex w-full p-5">
      <div className="menu-dropdown-scrollbar flex max-h-[9.85rem] flex-col overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="w-full shrink-0 items-center justify-center">
            {renderItem(item, () => onItemClick(item))}
          </div>
        ))}
      </div>
    </div>
  );
}
