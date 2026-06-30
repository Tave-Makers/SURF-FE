'use client';

import { HeaderMode } from '@surf/ui/header';
import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const PublicServicePolicyPage = () => {
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '[필수] SURF 서비스 이용약관',
          hasLeftIcon: true,
        }}
      />
      <PolicyDetailItem policyId="ServicePolicy" />
    </div>
  );
};

export default PublicServicePolicyPage;
