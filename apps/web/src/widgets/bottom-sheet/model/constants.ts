import { ReservationBottomSheet } from '@/features/post/post-form/ui/ReservationBottomSheet';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
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
  law: LawBottomSheet,
  reservation: ReservationBottomSheet,
} satisfies BottomSheetComponents;
