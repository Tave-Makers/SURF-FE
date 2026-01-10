import { LawBottomSheetProps } from '@/features/laws/ui/LawBottomSheet';

declare module '@/shared/store/bottomSheetStore' {
  interface BottomSheetMap {
    law: Omit<LawBottomSheetProps, 'isOpen' | 'onClose'>;
  }
}
