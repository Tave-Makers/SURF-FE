'use client';

import { PolicyItem } from '@/entities/policy/ui/PolicyItem';
import { useRouter } from 'next/navigation';
import { LAW_LIST } from '@/features/laws/constants/law-list';

export default function PolicyPage() {
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
}
