import { PostCategoryLabel } from '@/entities/post/model/category';

type PostBadgeProps = { type: 'category'; label: PostCategoryLabel } | { type: 'reservation' };

const RESERVATION_LABEL = '예약중';

const PostBadgeStyle =
  'rounded-3 text-caption-caption6 text-foreground-foreground-secondary-lighter bg-background-secondary inline-flex items-center justify-center px-7 py-5';

export const PostBadge = (props: PostBadgeProps) => {
  const text = props.type === 'category' ? props.label : RESERVATION_LABEL;

  return <span className={PostBadgeStyle}>{text}</span>;
};
