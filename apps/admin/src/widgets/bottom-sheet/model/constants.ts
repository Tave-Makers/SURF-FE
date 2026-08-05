import { ComponentType } from 'react';
import { CohortSelectBottomSheet } from '@/features/active-cohort/ui/CohortSelectBottomSheet';
import { GenerationBottomSheet } from '@/features/group-management/ui/GenerationBottomSheet';
import { GroupTypeBottomSheet } from '@/features/group-management/ui/GroupTypeBottomSheet';
import { PickLeaderBottomSheet } from '@/features/group-management/ui/PickLeaderBottomSheet';
import { SignupRequestBottomSheet } from '@/features/signup-request/ui/SignupRequestBottomSheet';
import type { BottomSheetMap, BottomSheetType } from '@/shared/store/bottomSheetStore';
import { MemberManagementSheet } from '@/widgets/member-management-sheet/MemberManagementSheet';

type BottomSheetComponents = {
  [K in BottomSheetType]: ComponentType<
    BottomSheetMap[K] & {
      isOpen: boolean;
      onClose: () => void;
    }
  >;
};

export const SHEET_COMPONENTS = {
  cohort: CohortSelectBottomSheet,
  signup: SignupRequestBottomSheet,
  member: MemberManagementSheet,
  generation: GenerationBottomSheet,
  groupType: GroupTypeBottomSheet,
  pickLeader: PickLeaderBottomSheet,
} satisfies BottomSheetComponents;
