import type { ComponentProps } from 'react';
import { SurfIcon } from '@/shared/ui/Icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type SolidButtonProps = {
  size: 's' | 'm' | 'l';
  variant: 'primary' | 'secondary' | 'danger' | 'warning';
  btnText: string;
  isDisabled?: boolean;
  leftIconName?: SurfIconName | null | undefined;
  rightIconName?: SurfIconName | null | undefined;
  onClick?: () => void;
};

export default function SolidButton({
  size = 'm',
  variant = 'primary',
  btnText,
  isDisabled = false,
  leftIconName,
  rightIconName,
  onClick,
}: SolidButtonProps) {
  const sizeMap: Record<typeof size, string> = {
    s: 'h-8 text-body-14-600--1-20',
    m: 'h-10 text-body-16-600--1',
    l: 'h-12 text-body-16-600--1',
  };

  const variantMap: Record<typeof variant, string> = {
    primary: 'text-foreground-accent bg-background-primary hover:bg-foreground-primary',
    secondary: 'text-foreground-normal bg-background-tertiary hover:bg-background-quaternary',
    danger: 'text-foreground-accent bg-foreground-danger hover:bg-foreground-danger-darker',
    warning: 'text-foreground-danger bg-background-tertiary hover:bg-background-quaternary',
  };

  const disabledClass =
    'bg-background-tertiary text-foreground-accent cursor-not-allowed opacity-50';

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex w-full items-center justify-center gap-1 rounded px-3 py-2.5',
        sizeMap[size],
        isDisabled ? disabledClass : variantMap[variant],
      ].join(' ')}
    >
      {leftIconName && <SurfIcon name={leftIconName} size={size} />}
      <span>{btnText}</span>
      {rightIconName && <SurfIcon name={rightIconName} size={size} />}
    </button>
  );
}
