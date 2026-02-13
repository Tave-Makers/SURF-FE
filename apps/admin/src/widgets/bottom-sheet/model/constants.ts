import { ChangeRoleSheet } from '@/features/member-role-change/ui/ChangeRoleSheet';
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
  changeRole: ChangeRoleSheet,
} satisfies BottomSheetComponents;
