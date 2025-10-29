import { SurfIcon } from '../icon/SurfIcon';

type SearchHistoryItemProps = {
  keyword?: string; // 검색 기록 키워드
  onSelect?: (keyword: string) => void; // 클릭 시 실행되는 콜백 (상위에 키워드 전달)
  onDelete?: () => void; // 삭제 버튼 클릭 시 실행되는 콜백
};

const SearchHistoryItem = ({ keyword = '', onSelect, onDelete }: SearchHistoryItemProps) => {
  const baseStyle =
    'flex w-fit items-center justify-center gap-7 h-[2rem] rounded-max border px-11 py-7';
  const colorStyle = 'bg-background-background-normal-lighter border-border-border-normal';
  const interactionStyle =
    'hover:bg-background-background-secondary-darker hover:border-border-border-secondary active:bg-background-background-secondary-darker active:border-border-border-secondary';

  return (
    <div
      className={`${baseStyle} ${colorStyle} ${interactionStyle}`}
      role="group"
      aria-label={`${keyword} 검색 기록`}
    >
      <button
        type="button"
        onClick={() => onSelect?.(keyword)}
        className="text-body-body7 text-foreground-foreground-normal"
        aria-label={`${keyword} 검색`}
      >
        {keyword}
      </button>
      <button
        type="button"
        onClick={() => {
          onDelete?.();
        }}
        aria-label="검색 기록 삭제"
        className="flex shrink-0 items-center"
      >
        <SurfIcon name="X" size="s" className="text-foreground-foreground-normal" />
      </button>
    </div>
  );
};

export default SearchHistoryItem;
