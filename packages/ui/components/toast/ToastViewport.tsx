'use client';

import { createPortal } from 'react-dom';
import { ToastStore, useToastStore } from '../../store/toastStore';
import { Toast } from './Toast';

const viewportStyle =
  'sm:max-w-[min(100dvw,calc(100dvh*375/812))] fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col px-10 pb-[5.75rem]';

export const ToastViewport = () => {
  const current = useToastStore((s: ToastStore) => s.current);

  if (typeof window === 'undefined') return null;
  if (!current) return null;

  return createPortal(
    <div className={viewportStyle} role="status" aria-live="polite" aria-atomic="true">
      <Toast text={current.text} />
    </div>,
    document.body,
  );
};
