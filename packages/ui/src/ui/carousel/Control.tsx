import { SurfIcon } from '../icon/SurfIcon';

type Direction = 'left' | 'right';

interface ControlProps {
  direction: Direction;
  onClick: () => void;
  className?: string;
}

export const Control = ({ direction, onClick, className = '' }: ControlProps) => {
  const isLeft = direction === 'left';

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="relative inline-flex">
        {/* 터치 영역 */}
        <span className="absolute -inset-[0.8rem]" aria-hidden />

        {/* 버튼 UI */}
        <span className="bg-background-carousel-pagenation flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-full">
          <SurfIcon
            name={isLeft ? 'ChevronLeft' : 'ChevronRight'}
            size="s"
            className="text-foreground-static-white"
          />
        </span>
      </span>
    </button>
  );
};
