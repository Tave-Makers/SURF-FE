import { PostBadgeProps } from '../model/types';

type Variation = 'event' | 'reservation';

const BADGE_TEXT_MAP: Record<Variation, string> = {
  event: '행사',
  reservation: '예약중',
} as const;

export const PostBadge = ({ variation }: PostBadgeProps) => {
  const text = BADGE_TEXT_MAP[variation];
  return (
    <span className="rounded-3 text-caption-caption6 text-foreground-foreground-secondary-lighter bg-background-background-secondary inline-flex items-center justify-center px-7 py-5">
      {text}
    </span>
  );
};
