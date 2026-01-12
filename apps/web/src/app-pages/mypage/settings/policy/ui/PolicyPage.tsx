'use client';

import { useRouter } from 'next/navigation';
import { PolicyItem } from '@/entities/policy/ui/PolicyItem';
import { LAW_LIST } from '@/features/laws/constants/law-list';

const PolicyPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      {LAW_LIST.map((law) => (
        <PolicyItem
          key={law.id}
          rightIconName="ChevronRight"
          onClick={() => router.push(law.route)}
        >
          {law.title}
        </PolicyItem>
      ))}
    </div>
  );
};

export default PolicyPage;
