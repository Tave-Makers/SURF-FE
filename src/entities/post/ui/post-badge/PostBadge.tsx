import { PostCategoryLabel, RESERVATION_LABEL } from '@/entities/post/model/constants';

type PostBadgeProps = { type: 'category'; category: PostCategoryLabel } | { type: 'reservation' };

export const PostBadge = (props: PostBadgeProps) => {
  const text = props.type === 'category' ? props.category : RESERVATION_LABEL;

  return (
    <span className="rounded-3 text-caption-caption6 text-foreground-foreground-secondary-lighter bg-background-background-secondary inline-flex items-center justify-center px-7 py-5">
      {text}
    </span>
  );
};
