import { SurfIcon } from '../icon/SurfIcon';
import { useEffect, useState } from 'react';

type LikeButtonProps = {
  isLiked: boolean;
  count: number;
};

const LikeButton = ({ isLiked = false, count = 0 }: LikeButtonProps) => {
  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleClick = () => {
    setLiked(!liked);
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
        name="Heart"
        size="s"
        color={liked ? 'red' : 'black'}
        fill={liked ? 'red' : ''}
        className="shrink-0"
      />
      <span className="text-body-body7 text-foreground-foreground-normal">{count}</span>
    </button>
  );
};

export default LikeButton;
