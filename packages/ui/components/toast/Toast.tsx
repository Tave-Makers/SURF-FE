'use client';

interface ToastProps {
  text: string;
}

const containerStyle =
  'flex items-center justify-start px-13 py-10 rounded-3 bg-background-normal-inverse-alpha';
const textStyle = 'text-body-body9 text-foreground-normal-reverse';

const Toast = ({ text }: ToastProps) => {
  return (
    <div className={containerStyle} role="status" aria-live="polite" aria-atomic="true">
      <span className={textStyle}>{text}</span>
    </div>
  );
};

export default Toast;
