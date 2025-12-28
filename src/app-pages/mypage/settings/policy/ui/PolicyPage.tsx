'use client';

import { PolicyItem } from '@/entities/policy/ui/PolicyItem';
import { useRouter } from 'next/navigation';
import { LAW_LIST } from '@/features/laws/constants/law-list';

export default function PolicyPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <PolicyItem
        rightIconName="ChevronRight"
        onClick={() => {
          router.push('/mypage/settings/policy/service');
        }}
      >
        {LAW_LIST[0].title}
      </PolicyItem>
      <PolicyItem
        rightIconName="ChevronRight"
        onClick={() => {
          router.push('/mypage/settings/policy/personal-info');
        }}
      >
        {LAW_LIST[1].title}
      </PolicyItem>
      <PolicyItem
        rightIconName="ChevronRight"
        onClick={() => {
          router.push('/mypage/settings/policy/marketing-info');
        }}
      >
        {LAW_LIST[2].title}
      </PolicyItem>
    </div>
  );
}
