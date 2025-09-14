import { SurfIcon } from '@/shared/ui/Icon/SurfIcon';

type SurfIconName = React.ComponentProps<typeof SurfIcon>['name'];

type TextButtonProps = {
  size: 's' | 'm' | 'l';
  variant: 'primary' | 'secondary' | 'warning';
  title: string;
  isDisabled?: boolean;
  leftIcon?: SurfIconName | null | undefined;
  rightIcon?: SurfIconName | null | undefined;
};

export default function TextButton({
  size = 'm',
  variant = 'primary',
  title,
  leftIcon,
  rightIcon,
  isDisabled = false,
}: TextButtonProps) {
  /** size에 따른 높이 + 텍스트 스타일 */
  const sizeMap: Record<typeof size, string> = {
    s: 'h-8 text-body-14-600--1-20',
    m: 'h-10 text-body-16-600--1',
    l: 'h-12 text-body-16-600--1',
  };

  /** 기본 상태 배경/텍스트 색 */
  const variantMap: Record<typeof variant, string> = {
    primary: 'text-background-primary hover:text-foreground-primary',
    secondary: 'text-foreground-normal-darker hover:text-foreground-normal',
    warning: 'text-foreground-danger hover:text-foreground-danger-darker',
  };

  /** disabled 상태 */
  const disabledClass: Record<typeof variant, string> = {
    primary: 'text-foreground-primary cursor-not-allowed opacity-30',
    secondary: 'text-foreground-normal-darker cursor-not-allowed opacity-30',
    warning: 'text-foreground-danger cursor-not-allowed opacity-30',
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={[
        'inline-flex w-full items-center justify-center gap-1 px-3 py-2.5',
        sizeMap[size],
        isDisabled ? disabledClass[variant] : variantMap[variant],
      ].join(' ')}
    >
      {leftIcon && <SurfIcon name={leftIcon} size={size} />}
      <span>{title}</span>
      {rightIcon && <SurfIcon name={rightIcon} size={size} />}
    </button>
  );
}
