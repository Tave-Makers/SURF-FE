'use client';

import AlertViewport from '../alert/AlertViewport';
import ToastViewport from '../toast/ToastViewport';

// import BottomSheetViewport from '@surf/ui/bottom-sheet/BottomSheetViewport";

export default function GlobalComponents() {
  return (
    <>
      <ToastViewport />
      <AlertViewport />
      {/* <BottomSheetViewport /> */}
    </>
  );
}
