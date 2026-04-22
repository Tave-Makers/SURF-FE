import SpinnerSvg from '../../assets/loading/spinner.svg';

type SpinnerSize = 'xs' | 's' | 'm' | 'l' | 'xl';

const sizeStyle: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4',
  s: 'w-6 h-6',
  m: 'w-8 h-8',
  l: 'w-12 h-12',
  xl: 'w-16 h-16',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export const Spinner = ({ size = 'm', className = '', label = '로딩 중' }: SpinnerProps) => {
  return (
    <SpinnerSvg className={`${sizeStyle[size]} ${className}`} role="status" aria-label={label} />
  );
};
