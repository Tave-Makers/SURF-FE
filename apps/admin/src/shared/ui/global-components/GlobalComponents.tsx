'use client';

import { AlertViewport } from '@surf/ui/alert';
import { ToastViewport } from '@surf/ui/toast';
import { BottomSheetViewport } from '@/widgets/bottom-sheet/ui/BottomSheetViewport';

export const GlobalComponents = () => {
  return (
    <>
      <ToastViewport />
      <AlertViewport />
      <BottomSheetViewport />
    </>
  );
};
