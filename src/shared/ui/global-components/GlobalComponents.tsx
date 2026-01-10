'use client';

import ToastViewport from '@/shared/ui/toast/ToastViewport';
import AlertViewport from '@/shared/ui/alert/AlertViewport';
import BottomSheetViewport from '@/widgets/bottom-sheet/ui/BottomSheetViewport';

export default function GlobalComponents() {
  return (
    <>
      <ToastViewport />
      <AlertViewport />
      <BottomSheetViewport />
    </>
  );
}
