import { SurfIcon } from '@surf/ui/icon';

type ScoreFloatingActionButtonProps = {
  onClick: () => void;
};

export const ScoreFloatingActionButton = ({ onClick }: ScoreFloatingActionButtonProps) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div className="relative mx-auto h-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
        <button
          type="button"
          aria-label="회원 점수 부여"
          onClick={onClick}
          className="shadow-floated bg-background-primary text-foreground-static-white hover:bg-background-primary-darker active:bg-background-primary-darker pointer-events-auto absolute right-15 bottom-15 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full transition-colors"
        >
          <SurfIcon name="Edit" size="xl" />
        </button>
      </div>
    </div>
  );
};
