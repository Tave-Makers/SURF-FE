'use client';

import { createPortal } from 'react-dom';
import Toast from './Toast';
import { useToastStore } from '@/shared/store/toastStore';

const ToastViewport = () => {
  const current = useToastStore((s) => s.current);

  if (typeof window === 'undefined') return null;
  if (!current) return null;

  return createPortal(
    <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col px-10 pb-[5.75rem]">
      <Toast text={current.text} />
    </div>,
    document.body,
  );
};

export default ToastViewport;
