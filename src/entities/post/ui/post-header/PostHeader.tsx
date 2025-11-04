import Link from 'next/link';

type CategoryItem = {
  title: string;
  href?: string;
};

type PostHeaderProps = {
  title: string;
  category?: CategoryItem;
  subCategory?: CategoryItem;
};

export function PostHeader({ title, category, subCategory }: PostHeaderProps) {
  const categoryClass =
    'cursor-pointer underline [text-underline-position:from-font] hover:opacity-80 transition-opacity';

  // 카테고리 공통 렌더링 함수
  const renderCategory = (item?: CategoryItem) => {
    if (!item) return null;
    return item.href ? (
      <Link href={item.href} className={categoryClass}>
        {item.title}
      </Link>
    ) : (
      <span className={categoryClass}>{item.title}</span>
    );
  };

  return (
    <header className="flex flex-col">
      {category && (
        <nav
          aria-label="게시글 카테고리 경로"
          className="text-caption-caption4 text-foreground-foreground-normal flex gap-3"
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
      <h1 className="text-foreground-foreground-normal text-body-body3 pt-10">{title}</h1>
    </header>
  );
}
