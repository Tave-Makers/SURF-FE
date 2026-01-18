import { ReservationBottomSheet } from '@/features/post/post-form/ui/ReservationBottomSheet';
import { PostCategoryBottomSheet } from '@/features/post/post-form/ui/PostCategoryBottomSheet';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { PostLikeBottomSheet } from '@/features/post/post-like/ui/PostLikeBottomSheet';
import { PostOptionBottomSheet } from '@/features/post/post-option/ui/PostOptionBottomSheet';
import { TrackPickerBottomSheet } from '@/features/onboarding/ui/TrackPickerBottomSheet';
import { ScheduleActionSheet } from '@/features/schedule/ui/ScheduleActionSheet/ScheduleActionSheet';
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
  postCategory: PostCategoryBottomSheet,
  postLike: PostLikeBottomSheet,
  postOption: PostOptionBottomSheet,
  trackPicker: TrackPickerBottomSheet,
  scheduleAction: ScheduleActionSheet,
} satisfies BottomSheetComponents;
