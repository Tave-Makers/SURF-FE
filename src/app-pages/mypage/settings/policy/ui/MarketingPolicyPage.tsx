'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';

export default function MarketingPolicyPage() {
  return (
    <div className="flex h-full">
      <PolicyDetailItem policyId="MarketingPolicy" />
    </div>
  );
}
