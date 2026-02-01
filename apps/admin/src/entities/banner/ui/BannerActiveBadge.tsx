interface BannerActiveBadgeProps {
  isActive: boolean;
}

const BADGE_STATE = {
  active: {
    label: '활성화중',
    variantColor: 'bg-background-notification text-foreground-primary-darker',
    dotVariantColor: 'bg-foreground-primary-darker',
  },
  inactive: {
    label: '비활성화',
    variantColor: 'bg-background-secondary-darker text-foreground-secondary-lighter',
    dotVariantColor: 'bg-foreground-secondary-lighter',
  },
} as const;

const baseClass = 'rounded-3 p-[0.25rem] gap-[0.25rem] items-center flex justify-center';
const baseDotClass = 'h-[0.5rem] w-[0.5rem] rounded-full';

export const BannerActiveBadge = ({ isActive }: BannerActiveBadgeProps) => {
  const { label, variantColor, dotVariantColor } = isActive
    ? BADGE_STATE.active
    : BADGE_STATE.inactive;
  return (
    <div className={`${baseClass} ${variantColor}`}>
      <span className={`${baseDotClass} ${dotVariantColor}`}></span>
      <div className="text-caption-caption5">{label}</div>
    </div>
  );
};
