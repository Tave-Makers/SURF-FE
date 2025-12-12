import type { ReactNode } from 'react';

/**
 * @param items - MenuDropDown 내의 아이템 리스트
 * @param renderItem - MenuDropDown 내의 각 아이템을 어떻게 렌더링할지 주입
 * @param onItemClick - MenuDropDown 내의 각 아이템 클릭 이벤트
 */

type MenuDropDownProps<T extends { id: number }> = {
  items: T[];
  renderItem: (item: T, onClick: () => void) => ReactNode;
  onItemClick: (item: T) => void;
};

export function MenuDropDown<T extends { id: number }>({
  items,
  renderItem,
  onItemClick,
}: MenuDropDownProps<T>) {
  return (
    <div className="rounded-3 bg-background-normal-lighter flex w-full flex-col p-5">
      {items.map((item) => (
        <div key={item.id} className="w-full items-center justify-center">
          {renderItem(item, () => onItemClick(item))}
        </div>
      ))}
    </div>
  );
}
