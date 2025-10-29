import { SurfIcon } from '../icon/SurfIcon';

type LikeButtonProps = {
  isLiked?: boolean; // 좋아요 상태 초기값
  count?: number; // 좋아요 개수 초기값
  onLikeToggle?: (newState: boolean) => void; // 클릭 시 실행되는 콜백 (외부에 상태 변경 알림)
};

const LikeButton = ({ isLiked = false, count = 0, onLikeToggle }: LikeButtonProps) => {
  // 버튼 클릭 시 내부 상태 갱신 및 콜백 실행
  const handleClick = () => {
    onLikeToggle?.(!isLiked);
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
