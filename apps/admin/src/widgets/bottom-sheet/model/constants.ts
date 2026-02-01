import { SignupRequestBottomSheet } from '@/features/signup-request/ui/SignupRequestBottomSheet';
import type { BottomSheetMap, BottomSheetType } from '@/shared/store/bottomSheetStore';
import type { ComponentType } from 'react';

type BottomSheetComponents = {
  [K in BottomSheetType]: ComponentType<
    BottomSheetMap[K] & {
      isOpen: boolean;
      onClose: () => void;
    }
  >;
};

export const SHEET_COMPONENTS = {
  signup: SignupRequestBottomSheet,
} satisfies BottomSheetComponents;
