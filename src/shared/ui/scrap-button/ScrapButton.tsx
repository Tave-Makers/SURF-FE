import { SurfIcon } from '../icon/SurfIcon';

type ScrapButtonProps = {
  isScraped?: boolean; // 스크랩 상태 초기값
  count?: number; // 스크랩 개수 초기값
  onScrapToggle?: (newState: boolean) => void; // 클릭 시 실행되는 콜백 (외부에 상태 변경 알림)
};

const ScrapButton = ({ isScraped = false, count = 0, onScrapToggle }: ScrapButtonProps) => {
  // 버튼 클릭 시 내부 상태 갱신 및 콜백 실행
  const handleClick = () => {
    onScrapToggle?.(!isScraped);
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
      aria-label={isScraped ? '스크랩 취소' : '스크랩'}
      aria-pressed={isScraped}
    >
      <SurfIcon
        name="Bookmark"
        size="s"
        className={`shrink-0 ${
          isScraped
            ? 'text-background-background-primary fill-background-background-primary'
            : 'text-foreground-foreground-normal'
        }`}
      />
      <span className="text-body-body7 text-foreground-foreground-normal">{count}</span>
    </button>
  );
};

export default ScrapButton;
