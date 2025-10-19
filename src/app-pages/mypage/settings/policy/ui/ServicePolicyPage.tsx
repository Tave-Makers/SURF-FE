'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function ServicePolicyPage() {
  return (
    <div className="flex h-full">
      <PolicyDetailItem policyId="ServicePolicy" />
    </div>
  );
}
