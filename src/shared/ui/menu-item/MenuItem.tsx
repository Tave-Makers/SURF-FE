/**
 * MenuItem 컴포넌트
 * @param label - MenuItem 텍스트
 * @param onClick - MenuItem 클릭 콜백함수
 * @param isSelected - MenuItem 선택 여부
 */

type MenuItemProps = {
  label: string;
  onClick: () => void;
  isSelected?: boolean;
};

export function MenuItem({ label, onClick, isSelected = false }: MenuItemProps) {
  const menuItemBaseStyle =
    'rounded-3 flex h-[1.87rem] min-w-[4.5rem] w-full items-center justify-center px-10 bg-background-normal-lighter active:bg-background-quaternary';

  const labelBaseStyle = isSelected
    ? 'text-foreground-primary text-body-body11'
    : 'text-foreground-normal-lighter text-body-body11';

  return (
    <button type="button" onClick={onClick} className={menuItemBaseStyle}>
      <span className={labelBaseStyle}>{label}</span>
    </button>
  );
}
