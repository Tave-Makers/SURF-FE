'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function PersonalInfoPolicyPage() {
  return (
    <div className="pb-[4.75rem]">
      <PolicyDetailItem policyId="PersonalInfoPolicy" />
    </div>
  );
}
