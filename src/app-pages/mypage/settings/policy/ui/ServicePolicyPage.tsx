'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function ServicePolicyPage() {
  return (
    <div className="flex h-full pb-[3.31rem]">
      <PolicyDetailItem policyId="ServicePolicy" />
    </div>
  );
}
