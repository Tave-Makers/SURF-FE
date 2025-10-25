import { SurfIcon } from '../icon/SurfIcon';
import { useEffect, useState } from 'react';

type ScrapButtonProps = {
  isScrapped: boolean;
  count: number;
};

const ScrapButton = ({ isScrapped = false, count = 0 }: ScrapButtonProps) => {
  const [scraped, setScraped] = useState(isScrapped);

  useEffect(() => {
    setScraped(isScrapped);
  }, [isScrapped]);

  const handleClick = () => {
    setScraped(!scraped);
  };

  const baseStyle =
    'flex items-center justify-center gap-8 h-[2.25rem] rounded-max border px-13 py-8';
  const colorStyle = 'bg-background-background-normal-lighter border-border-border-normal';
  const interactionStyle =
    'hover:bg-background-background-secondary-darker hover:border-border-border-secondary active:bg-background-background-secondary-darker active:border-border-border-secondary';

  return (
    <button
      className={`${baseStyle} ${colorStyle} ${interactionStyle}`}
      type="button"
      onClick={handleClick}
    >
      <SurfIcon
        name="Bookmark"
        size="s"
        color={scraped ? 'blue' : 'black'}
        fill={scraped ? 'blue' : ''}
        className="shrink-0"
      />
      <span className="text-body-body7 text-foreground-foreground-normal">{count}</span>
    </button>
  );
};

export default ScrapButton;
