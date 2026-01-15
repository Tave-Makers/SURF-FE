'use client';

import { createPortal } from 'react-dom';
import { SHEET_COMPONENTS } from '../model/constants';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export const BottomSheetViewport = () => {
  const current = useBottomSheetStore((s) => s.current);
  const close = useBottomSheetStore((s) => s.close);

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
};
