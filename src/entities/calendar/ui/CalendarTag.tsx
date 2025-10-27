type CalendarTagProps = {
  variation: 'official' | 'operation' | 'other';
};

const TAG_STYLE = {
  official: {
    text: '정규행사',
    color:
      'bg-background-background-tag-pink text-foreground-foreground-tag-pink shadow-[inset_0_0_10px_0_var(--background-background-tag-pink-darker,rgba(255,112,172,0.1))]',
  },
  operation: {
    text: '운영회의',
    color:
      'bg-background-background-tag-purple text-foreground-foreground-tag-purple shadow-[inset_0_0_10px_0_var(--background-background-tag-purple-darker,rgba(144,81,254,0.1))]',
  },
  other: {
    text: '기타일정',
    color:
      'bg-background-background-tag-green text-foreground-foreground-tag-green shadow-[inset_0_0_10px_0_var(--background-background-tag-green-darker,rgba(0,201,90,0.1))]',
  },
} as const;

export const CalendarTag = ({ variation }: CalendarTagProps) => {
  const { text, color } = TAG_STYLE[variation];
  return (
    <span
      className={`rounded-3 text-caption-caption5 inline-flex items-center justify-center px-7 py-5 ${color}`}
    >
      {text}
    </span>
  );
};
