import { SurfIcon } from '../icon/SurfIcon';

/**
 * 검색 기록 아이템 컴포넌트
 *
 * 개별 검색어 히스토리를 표시하며, 클릭 시 해당 키워드를 상위 컴포넌트로 전달합니다.
 * 삭제 버튼 클릭 시 onDelete 콜백이 호출되어 상위에서 해당 기록을 제거할 수 있습니다.
 *
 * @param {SearchHistoryItemProps} props
 * @param {string} [props.keyword=''] - 검색 기록 키워드
 * @param {(keyword: string) => void} [props.onSelect] - 키워드 클릭 시 호출되는 콜백 (상위에 선택된 키워드 전달)
 * @param {() => void} [props.onDelete] - 삭제 버튼 클릭 시 호출되는 콜백 (상위에서 해당 기록 삭제 처리)
 *
 * @example
 * ```tsx
 * const handleSelect = (keyword: string) => {
 *   setSearchValue(keyword);
 *   performSearch(keyword);
 * };
 *
 * const handleDelete = () => {
 *   removeHistory(keyword);
 * };
 *
 * <SearchHistoryItem
 *   keyword="React Query"
 *   onSelect={handleSelect}
 *   onDelete={handleDelete}
 * />
 * ```
 */

export type SearchHistoryItemProps = {
  keyword?: string;
  onSelect?: (keyword: string) => void;
  onDelete?: () => void;
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
