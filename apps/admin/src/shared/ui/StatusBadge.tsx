export type StatusBadgeVariant = 'pink' | 'purple' | 'green';
const VARIANT_STYLE = {
  pink: 'bg-background-badge-pink text-foreground-badge-pink shadow-[inset_0_0_10px_0_var(--background-tag-pink-darker,rgba(255,112,172,0.1))]',
  purple:
    'bg-background-badge-purple text-foreground-badge-purple shadow-[inset_0_0_10px_0_var(--background-tag-purple-darker,rgba(144,81,254,0.1))]',
  green:
    'bg-background-badge-green text-foreground-badge-green shadow-[inset_0_0_10px_0_var(--background-tag-green-darker,rgba(0,201,90,0.1))]',
} as const;

/**
 * 상태를 강조해 표시하는 작은 배지 컴포넌트.
 *
 * @example
 * <StatusBadge variant="green">승인</StatusBadge>
 */
export const StatusBadge = ({
  variant,
  children,
}: {
  variant: StatusBadgeVariant;
  children: React.ReactNode;
}) => {
  const color = VARIANT_STYLE[variant];

  return (
    <span
      className={`rounded-3 text-caption-caption5 inline-flex h-fit w-fit items-center px-8 py-5 text-nowrap ${color}`}
    >
      {children}
    </span>
  );
};
