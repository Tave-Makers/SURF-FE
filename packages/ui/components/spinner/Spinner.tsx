import SpinnerSvg from '../../assets/loading/spinner.svg';

type SpinnerSize = 's' | 'm' | 'l';

const sizeStyle: Record<SpinnerSize, string> = {
  s: 'w-[50px] h-[50px]',
  m: 'w-[100px] h-[100px]',
  l: 'w-[250px] h-[250px]',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export const Spinner = ({ size = 's', className = '', label = '로딩 중' }: SpinnerProps) => {
  return (
    <SpinnerSvg className={`${sizeStyle[size]} ${className}`} role="status" aria-label={label} />
  );
};
