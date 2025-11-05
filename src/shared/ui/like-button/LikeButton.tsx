import { SurfIcon } from '../icon/SurfIcon';

/**
 * 좋아요 버튼 컴포넌트 (Controlled Component)
 *
 * 내부 상태를 관리하지 않으며, 부모 컴포넌트가 isLiked와 count를 관리해야 합니다.
 * 클릭 시 onLikeToggle 콜백을 호출하여 새로운 상태를 부모에게 전달합니다.
 *
 * @param {LikeButtonProps} props
 * @param {boolean} [props.isLiked=false] - 현재 좋아요 상태 (부모에서 관리)
 * @param {number} [props.count=0] - 좋아요 개수 (부모에서 관리)
 * @param {(newState: boolean) => void} [props.onLikeToggle] - 상태 변경 시 호출되는 콜백
 *
 * @example
 * ```tsx
 * const [isLiked, setIsLiked] = useState(false);
 * const [count, setCount] = useState(42);
 *
 * <LikeButton
 *   isLiked={isLiked}
 *   count={count}
 *   onLikeToggle={(newState) => {
 *     setIsLiked(newState);
 *     setCount(prev => prev + (newState ? 1 : -1));
 *   }}
 * />
 * ```
 */

export type LikeButtonProps = {
  isLiked: boolean;
  count: number;
  onLikeToggle: (newState: boolean) => void;
};

const LikeButton = ({ isLiked, count, onLikeToggle }: LikeButtonProps) => {
  // 버튼 클릭 시 내부 상태 갱신 및 콜백 실행
  const handleClick = () => {
    onLikeToggle(!isLiked);
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
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      aria-pressed={isLiked}
    >
      <SurfIcon
        name="Heart"
        size="s"
        className={`shrink-0 ${
          isLiked
            ? 'text-foreground-foreground-danger fill-foreground-foreground-danger'
            : 'text-foreground-foreground-normal'
        }`}
      />
      <span className="text-body-body7 text-foreground-foreground-normal">{count}</span>
    </button>
  );
};

export default LikeButton;
