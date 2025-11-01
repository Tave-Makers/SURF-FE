import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type EditButtonProps = {
  onClick?: () => void;
};

const EditButton = ({ onClick }: EditButtonProps) => {
  return (
    <button
      type="button"
      className="bg-background-background-primary hover:bg-background-background-primary-darker active:bg-background-background-primary-darker rounded-max flex p-13 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
      onClick={onClick}
      aria-label="게시글 작성 버튼"
    >
      <SurfIcon name="Edit" className="text-foreground-foreground-accent" />
    </button>
  );
};

export default EditButton;
