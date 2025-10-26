type PostHeaderProps = {
  title: string;
  category?: string;
  subCategory?: string;
};

export function PostHeader({ title, category, subCategory }: PostHeaderProps) {
  return (
    <>
      <div>
        {category} {subCategory && `> ${subCategory}`}
      </div>
      <div>{title}</div>
    </>
  );
}
