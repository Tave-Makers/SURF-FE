'use client';

import ToastViewport from '@/shared/ui/toast/ToastViewport';
import AlertViewport from '@/shared/ui/alert/AlertViewport';
// import BottomSheetViewport from "@/shared/ui/bottom-sheet/BottomSheetViewport";

export default function GlobalComponents() {
  return (
    <>
      <ToastViewport />
      <AlertViewport />
      {/* <BottomSheetViewport /> */}
    </>
  );
}
