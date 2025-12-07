interface PagenationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagenation = ({ currentPage, totalPages }: PagenationProps) => {
  return (
    // TODO: 디자인 토큰 업데이트 시 스타일 적용 확인
    <div className="text-foreground-static-white text-caption-caption6 rounded-max bg-background-carousel-pagenation inline-flex items-center justify-center gap-6 px-7 py-3">
      <div>{currentPage}</div>
      <div className="bg-foreground-static-white h-[8px] w-[1px]" />
      <div>{totalPages}</div>
    </div>
  );
};
