interface PagenationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

/* TODO:  background-carousel-pagenation 토큰 생성 및 배경 색상에 적용*/
const baseClass =
  'text-foreground-static-white text-caption-caption6 rounded-max bg-[#ffffff4d] inline-flex items-center justify-center gap-6 px-7 py-3';

export const Pagenation = ({ currentPage, totalPages, className = '' }: PagenationProps) => {
  return (
    <div className={`${baseClass} ${className}`}>
      <div>{currentPage}</div>
      <div className="bg-foreground-static-white h-[8px] w-[1px]" />
      <div>{totalPages}</div>
    </div>
  );
};
