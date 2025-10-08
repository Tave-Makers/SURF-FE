'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function MarketingPolicyPage() {
  return (
    <div className="flex h-full pb-[3.81rem]">
      <PolicyDetailItem policyId="MarketingPolicy" />
    </div>
  );
}
