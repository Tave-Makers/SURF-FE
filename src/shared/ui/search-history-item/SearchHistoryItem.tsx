import { SurfIcon } from '../icon/SurfIcon';

type SearchHistoryItemProps = {
  keyword?: string; // 검색 기록 키워드
  onSelect?: (keyword: string) => void; // 클릭 시 실행되는 콜백 (상위에 키워드 전달)
  onDelete?: () => void; // 삭제 버튼 클릭 시 실행되는 콜백
};

const SearchHistoryItem = ({ keyword = '', onSelect, onDelete }: SearchHistoryItemProps) => {
  const baseStyle = 'flex items-center justify-center gap-7 h-[2rem] rounded-max border px-11 py-7';
  const colorStyle = 'bg-background-background-normal-lighter border-border-border-normal';
  const interactionStyle =
    'hover:bg-background-background-secondary-darker hover:border-border-border-secondary active:bg-background-background-secondary-darker active:border-border-border-secondary';

  return (
    <button
      className={`${baseStyle} ${colorStyle} ${interactionStyle}`}
      type="button"
      onClick={() => onSelect?.(keyword)}
    >
      <span className="text-body-body7 text-foreground-foreground-normal">{keyword}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // 부모 버튼 클릭 이벤트 전파 방지
          onDelete?.();
        }}
        className="shrink-0"
      >
        <SurfIcon name="X" size="s" color="black" />
      </button>
    </button>
  );
};

export default SearchHistoryItem;
