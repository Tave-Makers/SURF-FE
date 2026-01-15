import Link from 'next/link';

export type CategoryItem = {
  title: string | null;
  href?: string;
};

export type PostHeaderProps = {
  title: string;
  category?: CategoryItem;
  subCategory?: CategoryItem;
};

export const PostHeader = ({ title, category, subCategory }: PostHeaderProps) => {
  const baseClass = 'underline [text-underline-position:from-font]';
  const interactiveClass = 'cursor-pointer';

  // 카테고리 공통 렌더링 함수
  const renderCategory = (item?: CategoryItem) => {
    if (!item) return null;
    return item.href ? (
      <Link href={item.href} className={`${baseClass} ${interactiveClass}`}>
        {item.title}
      </Link>
    ) : (
      <span className={baseClass}>{item.title}</span>
    );
  };

  return (
    <header className="flex flex-col">
      {category && (
        <nav
          aria-label="게시글 카테고리 경로"
          className="text-caption-caption4 text-foreground-normal flex gap-3"
        >
          {renderCategory(category)}
          {subCategory && (
            <>
              <span aria-hidden="true" role="presentation">
                {'>'}
              </span>
              {renderCategory(subCategory)}
            </>
          )}
        </nav>
      )}
      <h1 className="text-foreground-normal text-body-body3 pt-10">{title}</h1>
    </header>
  );
};
