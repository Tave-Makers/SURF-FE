import type { ComponentProps } from 'react';
import { SurfIcon } from '@/shared/ui/Icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type TextButtonProps = {
  size: 's' | 'm' | 'l';
  variant: 'primary' | 'secondary' | 'warning';
  btnText: string;
  isDisabled?: boolean;
  leftIconName?: SurfIconName | null | undefined;
  rightIconName?: SurfIconName | null | undefined;
  onClick?: () => void;
};

export default function TextButton({
  size = 'm',
  variant = 'primary',
  btnText,
  leftIconName,
  rightIconName,
  isDisabled = false,
  onClick,
}: TextButtonProps) {
  const sizeMap: Record<typeof size, string> = {
    s: 'h-8 text-body-14-600--1-20',
    m: 'h-10 text-body-16-600--1',
    l: 'h-12 text-body-16-600--1',
  };

  const variantMap: Record<typeof variant, string> = {
    primary: 'text-background-primary hover:text-foreground-primary',
    secondary: 'text-foreground-normal-darker hover:text-foreground-normal',
    warning: 'text-foreground-danger hover:text-foreground-danger-darker',
  };

  const disabledClass: Record<typeof variant, string> = {
    primary: 'text-foreground-primary cursor-not-allowed opacity-30',
    secondary: 'text-foreground-normal-darker cursor-not-allowed opacity-30',
    warning: 'text-foreground-danger cursor-not-allowed opacity-30',
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex w-full items-center justify-center gap-1 px-3 py-2.5',
        sizeMap[size],
        isDisabled ? disabledClass[variant] : variantMap[variant],
      ].join(' ')}
    >
      {leftIconName && <SurfIcon name={leftIconName} size={size} />}
      <span>{btnText}</span>
      {rightIconName && <SurfIcon name={rightIconName} size={size} />}
    </button>
  );
}
