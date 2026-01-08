'use client';

import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';

export default function PersonalInfoPolicyPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '개인정보 수집·이용 동의서',
          hasLeftIcon: true,
        }}
      />
      <PolicyDetailItem policyId="PersonalInfoPolicy" />
    </div>
  );
}
