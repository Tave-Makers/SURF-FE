type CalendarBadgeProps = {
  variation: 'regular' | 'operation' | 'other';
};

const BADGE_STYLE = {
  regular: {
    text: '정규행사',
    color:
      'bg-background-badge-pink text-foreground-badge-pink shadow-[inset_0_0_10px_0_var(--background-tag-pink-darker,rgba(255,112,172,0.1))]',
  },
  operation: {
    text: '운영회의',
    color:
      'bg-background-badge-purple text-foreground-badge-purple shadow-[inset_0_0_10px_0_var(--background-tag-purple-darker,rgba(144,81,254,0.1))]',
  },
  other: {
    text: '기타일정',
    color:
      'bg-background-badge-green text-foreground-badge-green shadow-[inset_0_0_10px_0_var(--background-tag-green-darker,rgba(0,201,90,0.1))]',
  },
} as const;

export const CalendarBadge = ({ variation }: CalendarBadgeProps) => {
  const { text, color } = BADGE_STYLE[variation] || BADGE_STYLE.regular;
  return (
    <span
      className={`rounded-3 text-caption-caption5 inline-flex items-center justify-center px-7 py-5 ${color}`}
    >
      {text}
    </span>
  );
};
