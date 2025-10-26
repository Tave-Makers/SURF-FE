type PostHeaderProps = {
  title: string;
  category?: string;
  subCategory?: SubCategoryType;
};

export type SubCategoryType = '전체' | '행사' | '활동' | '제휴' | '릴리즈' | '기타';

export function PostHeader({ title, category, subCategory }: PostHeaderProps) {
  const categoryClass = 'cursor-pointer underline [text-underline-position:from-font]';
  return (
    <>
      <div className="flex flex-col">
        <div className="text-caption-caption4 item text-foreground-foreground-normal flex gap-3">
          {category && (
            <>
              {/* 링크는 추후 연결 */}
              <div className={categoryClass}>{category}</div>
              {subCategory && (
                <>
                  <div>{`>`}</div>
                  {/* 링크는 추후 연결 */}
                  <div className={categoryClass}>{subCategory}</div>
                </>
              )}
            </>
          )}
        </div>
        <div className="text-foreground-foreground-normal text-body-body3 pt-10">{title}</div>
      </div>
    </>
  );
}
