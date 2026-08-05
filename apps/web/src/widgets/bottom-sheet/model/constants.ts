import type { ComponentType } from 'react';
import { CommentOptionBottomSheet } from '@/features/comment/ui/CommentOptionBottomSheet';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { TrackPickerBottomSheet } from '@/features/onboarding/ui/TrackPickerBottomSheet';
import { PostCategoryBottomSheet } from '@/features/post/post-form/ui/PostCategoryBottomSheet';
import { ReservationBottomSheet } from '@/features/post/post-form/ui/ReservationBottomSheet';
import { PostLikeBottomSheet } from '@/features/post/post-like/ui/PostLikeBottomSheet';
import { PostOptionBottomSheet } from '@/features/post/post-option/ui/PostOptionBottomSheet';
import { ScheduleActionSheet } from '@/features/schedule/ui/ScheduleActionSheet/ScheduleActionSheet';
import { ScheduleCategoryBottomSheet } from '@/features/schedule/ui/ScheduleCategoryBottomSheet';
import { ScheduleDateBottomSheet } from '@/features/schedule/ui/ScheduleDateBottomSheet';
import type { BottomSheetMap, BottomSheetType } from '@/shared/store/bottomSheetStore';

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
  commentOption: CommentOptionBottomSheet,
  scheduleCategory: ScheduleCategoryBottomSheet,
  scheduleDate: ScheduleDateBottomSheet,
} satisfies BottomSheetComponents;
