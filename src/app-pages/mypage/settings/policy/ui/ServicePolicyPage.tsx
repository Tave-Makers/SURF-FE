'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function ServicePolicyPage() {
  return (
    <div className="pb-[3.31rem]">
      <PolicyDetailItem policyId="ServicePolicy" />
    </div>
  );
}
