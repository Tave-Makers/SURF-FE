'use client';

import { HeaderMode } from '@surf/ui/header';
import { PolicyDetailItem } from '@/entities/policy/ui/PolicyDetailItem';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const PublicOperationalPolicyPage = () => {
  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '[필수] SURF 운영정책',
          hasLeftIcon: true,
        }}
      />
      <PolicyDetailItem policyId="OperatingPolicy" />
    </div>
  );
};

export default PublicOperationalPolicyPage;
