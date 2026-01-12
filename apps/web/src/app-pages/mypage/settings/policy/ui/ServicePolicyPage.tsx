'use client';

import { HeaderMode } from '@surf/ui/header';
import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const ServicePolicyPage = () => {
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: 'SURF 서비스 이용약관',
          hasLeftIcon: true,
        }}
      />
      <PolicyDetailItem policyId="ServicePolicy" />
    </div>
  );
};

export default ServicePolicyPage;
