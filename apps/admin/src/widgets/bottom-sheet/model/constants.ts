import { GenerationBottomSheet } from '@/features/group-management/ui/GenerationBottomSheet';
import { GroupTypeBottomSheet } from '@/features/group-management/ui/GroupTypeBottomSheet';
import { SignupRequestBottomSheet } from '@/features/signup-request/ui/SignupRequestBottomSheet';
import type { BottomSheetMap, BottomSheetType } from '@/shared/store/bottomSheetStore';
import { MemberManagementSheet } from '@/widgets/member-management-sheet/MemberManagementSheet';
import { ComponentType } from 'react';

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
  member: MemberManagementSheet,
  generation: GenerationBottomSheet,
  groupType: GroupTypeBottomSheet,
} satisfies BottomSheetComponents;
