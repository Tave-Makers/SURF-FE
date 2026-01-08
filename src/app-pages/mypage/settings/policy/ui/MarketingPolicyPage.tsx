'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';

export default function MarketingPolicyPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '[선택] 마케팅 정보 수신 동의',
          hasLeftIcon: true,
        }}
      />
      <PolicyDetailItem policyId="MarketingPolicy" />
    </div>
  );
}
