'use client';

import { AlertViewport } from '@surf/ui/alert';
import { ToastViewport } from '@surf/ui/toast';
import { BottomSheetViewport } from '../bottom-sheet/ui/BottomSheetViewport';

export const GlobalComponents = () => {
  return (
    <>
      <div id="bottom-sheet-root" className="relative z-[9999]" />
      <div id="toast-root" className="relative z-[10001]" />
      <div id="alert-root" className="relative z-[20000]" />
      <ToastViewport />
      <AlertViewport />
      <BottomSheetViewport />
    </>
  );
};
