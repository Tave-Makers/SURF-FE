import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import type { MouseEventHandler } from 'react';

type PostFabProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const POST_FAB_CLASS =
  'bg-background-background-primary hover:bg-background-background-primary-darker active:bg-background-background-primary-darker rounded-max flex p-13 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none';

export const PostFab = ({ onClick }: PostFabProps) => {
  return (
    <button
      type="button"
      className={POST_FAB_CLASS}
      onClick={onClick}
      aria-label="게시글 작성 버튼"
    >
      <SurfIcon name="Edit" className="text-foreground-foreground-accent" />
    </button>
  );
};
