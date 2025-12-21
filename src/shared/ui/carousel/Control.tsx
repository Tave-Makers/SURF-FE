import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

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
        {/* TODO:  background-carousel-pagenation 토큰 생성 및 배경 색상에 적용*/}
        <span className="flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-full bg-[#ffffff4d]">
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
