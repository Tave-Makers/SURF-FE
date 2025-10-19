'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function PersonalInfoPolicyPage() {
  return (
    <div className="flex h-full">
      <PolicyDetailItem policyId="PersonalInfoPolicy" />
    </div>
  );
}
