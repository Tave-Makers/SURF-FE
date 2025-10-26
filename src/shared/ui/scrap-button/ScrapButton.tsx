import { SurfIcon } from '../icon/SurfIcon';
import { useState } from 'react';

type ScrapButtonProps = {
  isScrapped?: boolean; // 스크랩 상태 초기값
  count?: number; // 스크랩 개수 초기값
  onToggle?: (newState: boolean) => void; // 클릭 시 실행되는 콜백 (외부에 상태 변경 알림)
};

const ScrapButton = ({ isScrapped = false, count = 0, onToggle }: ScrapButtonProps) => {
  const [scraped, setScraped] = useState(isScrapped);

  // 버튼 클릭 시 내부 상태 갱신 및 콜백 실행
  const handleClick = () => {
    const newState = !scraped;
    setScraped(newState);
    onToggle?.(newState);
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
      aria-label={scraped ? '스크랩 취소' : '스크랩'}
      aria-pressed={scraped}
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
