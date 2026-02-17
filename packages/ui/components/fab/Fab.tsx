import type { MouseEventHandler } from 'react';
import { SurfIcon } from '@surf/ui/icon';

type FabProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const FabStyle =
  'bg-background-primary hover:bg-background-primary-darker active:bg-background-primary-darker shadow-floated rounded-max flex p-13 transition-colors duration-200 focus-visible:outline-none';

export const Fab = ({ onClick }: FabProps) => {
  return (
    <button type="button" className={FabStyle} onClick={onClick} aria-label="게시글 작성 버튼">
      <SurfIcon name="Edit" className="text-foreground-static-white" size="xl" />
    </button>
  );
};
