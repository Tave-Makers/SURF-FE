import { SelectField } from '@surf/ui/select-field';

import { ChangeRoleDialog } from './ChangeRoleDialog';
import { MEMBER_ROLE_LABELS } from '@/entities/member/model/constants';
import type { MemberRole } from '@/entities/member/model/types';

type MemberRoleChangeFieldProps = {
  memberId: number;
  role: MemberRole;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const MemberRoleChangeField = ({
  memberId,
  role,
  isOpen,
  onOpenChange,
}: MemberRoleChangeFieldProps) => {
  return (
    <>
      <SelectField
        size="l"
        aria-label="멤버 역할"
        selectedValue={MEMBER_ROLE_LABELS[role]}
        onClick={() => onOpenChange(true)}
      />
      <ChangeRoleDialog
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        memberId={memberId}
        initialRole={role}
      />
    </>
  );
};
