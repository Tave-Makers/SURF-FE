type PostHeaderProps = {
  title: string;
  category?: string;
  subCategory?: SubCategoryType;
};

export type SubCategoryType = '전체' | '행사' | '활동' | '제휴' | '릴리즈' | '기타';

export function PostHeader({ title, category, subCategory }: PostHeaderProps) {
  const categoryClass = 'cursor-pointer underline [text-underline-position:from-font]';
  return (
    <header className="flex flex-col">
      {category && (
        <nav
          aria-label="게시글 카테고리 경로"
          className="text-caption-caption4 text-foreground-foreground-normal flex gap-3"
        >
          {/* 링크는 추후 연결 */}
          <span className={categoryClass}>{category}</span>
          {subCategory && (
            <>
              <span aria-hidden="true">{'>'}</span>
              {/* 링크는 추후 연결 */}
              <span className={categoryClass}>{subCategory}</span>
            </>
          )}
        </nav>
      )}

      <h1 className="text-foreground-foreground-normal text-body-body3 pt-10">{title}</h1>
    </header>
  );
}
