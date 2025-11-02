import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

/**
 * 스크랩 버튼 컴포넌트 (Controlled Component)
 *
 * 내부 상태를 관리하지 않으며, 부모 컴포넌트가 isScrapped와 count를 관리해야 합니다.
 * 클릭 시 onScrapToggle 콜백을 호출하여 새로운 상태를 부모에게 전달합니다.
 *
 * @param {ScrapButtonProps} props
 * @param {boolean} [props.isScrapped=false] - 현재 스크랩 상태 (부모에서 관리)
 * @param {number} [props.count=0] - 스크랩 개수 (부모에서 관리)
 * @param {(newState: boolean) => void} [props.onScrapToggle] - 상태 변경 시 호출되는 콜백
 *
 * @example
 * ```tsx
 * const [isScrapped, setIsScrapped] = useState(false);
 * const [count, setCount] = useState(12);
 *
 * <ScrapButton
 *   isScrapped={isScrapped}
 *   count={count}
 *   onScrapToggle={(newState) => {
 *     setIsScrapped(newState);
 *     setCount(prev => prev + (newState ? 1 : -1));
 *   }}
 * />
 * ```
 */

export type ScrapButtonProps = {
  isScrapped: boolean;
  count: number;
  onScrapToggle: (newState: boolean) => void;
};

const ScrapButton = ({ isScrapped, count, onScrapToggle }: ScrapButtonProps) => {
  // 클릭 시 외부 콜백 실행
  const handleClick = () => {
    onScrapToggle(!isScrapped);
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
      aria-label={isScrapped ? '스크랩 취소' : '스크랩'}
      aria-pressed={isScrapped}
    >
      <SurfIcon
        name="Bookmark"
        size="s"
        className={`shrink-0 ${
          isScrapped
            ? 'text-background-background-primary fill-background-background-primary'
            : 'text-foreground-foreground-normal'
        }`}
      />
      <span className="text-body-body7 text-foreground-foreground-normal">{count}</span>
    </button>
  );
};

export default ScrapButton;
