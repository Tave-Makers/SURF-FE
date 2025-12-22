/**
 * MenuItem 컴포넌트
 * @param label - MenuItem 텍스트
 * @param onClick - MenuItem 클릭 콜백함수
 * @param isSelected - MenuItem 선택 여부
 */

interface MenuItemProps {
  label: string;
  onClick: () => void;
  isSelected?: boolean;
}

export function MenuItem({ label, onClick, isSelected = false }: MenuItemProps) {
  const menuItemBaseStyle =
    'rounded-3 bg-background-normal-lighter active:bg-background-quaternary flex h-[1.87rem] w-full min-w-[4.5rem] items-center justify-center truncate px-10';

  const labelBaseStyle = isSelected
    ? 'text-foreground-primary text-body-body11'
    : 'text-foreground-secondary text-body-body11';

  return (
    <button type="button" onClick={onClick} className={menuItemBaseStyle}>
      <span className={labelBaseStyle}>{label}</span>
    </button>
  );
}
