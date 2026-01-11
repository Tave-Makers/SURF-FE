'use client';

import { useEffect } from 'react';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { createPortal } from 'react-dom';
import '@/features/laws/model/lawBottomSheetSchema';

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
  }, [current]);

  if (typeof window === 'undefined') return null;
  if (!current) return null;

  if (current.type === 'law') {
    return createPortal(
      <LawBottomSheet {...current.props} isOpen={true} onClose={close} />,
      document.body,
    );
  }

  return null;
}
