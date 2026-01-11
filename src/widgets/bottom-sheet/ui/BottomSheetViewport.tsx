'use client';

import { useEffect } from 'react';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { createPortal } from 'react-dom';
import '@/features/laws/model/lawBottomSheetSchema';
import { SHEET_COMPONENTS } from '../model/constants';

export default function BottomSheetViewport() {
  const current = useBottomSheetStore((s) => s.current);
  const close = useBottomSheetStore((s) => s.close);

  useEffect(() => {
    if (current) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.classList.add('lock-interaction');
    } else {
      document.body.classList.remove('lock-interaction');
    }
    return () => {
      document.body.classList.remove('lock-interaction');
    };
  }, [current]);

  if (typeof window === 'undefined') return null;
  if (!current) return null;

  const Component = SHEET_COMPONENTS[current.type];

  if (!Component) {
    return null;
  }

  return createPortal(
    <Component
      {...(current.props as React.ComponentProps<typeof Component>)}
      isOpen={true}
      onClose={close}
    />,
    document.body,
  );
}
