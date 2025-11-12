import type { PostCategory } from '@/entities/post/model/types';
import { POST_CATEGORY_LABEL_MAP, RESERVATION_LABEL } from '@/entities/post/model/postCategoryMap';

type PostBadgeProps =
  | { type: 'category'; category: Exclude<PostCategory, 'all'> }
  | { type: 'reservation' };

export const PostBadge = (props: PostBadgeProps) => {
  const text =
    props.type === 'category' ? POST_CATEGORY_LABEL_MAP[props.category] : RESERVATION_LABEL;

  return (
    <span className="rounded-3 text-caption-caption6 text-foreground-foreground-secondary-lighter bg-background-background-secondary inline-flex items-center justify-center px-7 py-5">
      {text}
    </span>
  );
};
