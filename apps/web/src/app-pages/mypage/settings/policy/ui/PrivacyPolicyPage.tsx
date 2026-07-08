'use client';

import { HeaderMode } from '@surf/ui/header';
import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const PrivacyPolicyPage = () => {
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '[필수] 개인정보 처리방침',
          hasLeftIcon: true,
        }}
      />
      <PolicyDetailItem policyId="PersonalInfoPolicy" />
    </div>
  );
};

export default PrivacyPolicyPage;
