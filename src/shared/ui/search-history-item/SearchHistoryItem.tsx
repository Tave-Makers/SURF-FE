import { SurfIcon } from '../icon/SurfIcon';

type SearchHistoryItemProps = {
  keyword: string;
};

const SearchHistoryItem = ({ keyword = '' }: SearchHistoryItemProps) => {
  const baseStyle = 'flex items-center justify-center gap-7 h-[2rem] rounded-max border px-11 py-7';
  const colorStyle = 'bg-background-background-normal-lighter border-border-border-normal';
  const interactionStyle =
    'hover:bg-background-background-secondary-darker hover:border-border-border-secondary active:bg-background-background-secondary-darker active:border-border-border-secondary';

  return (
    <button className={`${baseStyle} ${colorStyle} ${interactionStyle}`} type="button">
      <span className="text-body-body7 text-foreground-foreground-normal">{keyword}</span>
      <SurfIcon name="X" size="s" color="black" className="shrink-0" />
    </button>
  );
};

export default SearchHistoryItem;
