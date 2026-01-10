'use client';

import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { createPortal } from 'react-dom';
import '@/features/laws/model/lawBottomSheetSchema';

export default function BottomSheetViewport() {
  const current = useBottomSheetStore((s) => s.current);
  const close = useBottomSheetStore((s) => s.close);

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
