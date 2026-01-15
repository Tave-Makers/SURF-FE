import { SurfIcon } from '@surf/ui/icon';
import type { MouseEventHandler } from 'react';

type PostFabProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const postFabStyle =
  'bg-background-primary hover:bg-background-primary-darker active:bg-background-primary-darker shadow-floated rounded-max flex p-13 transition-colors duration-200 focus-visible:outline-none';

export const PostFab = ({ onClick }: PostFabProps) => {
  return (
    <button type="button" className={postFabStyle} onClick={onClick} aria-label="게시글 작성 버튼">
      <SurfIcon name="Edit" className="text-foreground-static-white" size="xl" />
    </button>
  );
};
