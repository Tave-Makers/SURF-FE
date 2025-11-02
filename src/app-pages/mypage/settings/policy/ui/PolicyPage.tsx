'use client';

import { PolicyItem } from '@/entities/policy/ui/PolicyItem';
import { useRouter } from 'next/navigation';

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
        [필수] SURF 이용약관
      </PolicyItem>
      <PolicyItem
        rightIconName="ChevronRight"
        onClick={() => {
          router.push('/mypage/settings/policy/personal-info');
        }}
      >
        [필수] 개인정보 수집·이용 동의서
      </PolicyItem>
      <PolicyItem
        rightIconName="ChevronRight"
        onClick={() => {
          router.push('/mypage/settings/policy/marketing-info');
        }}
      >
        [선택] 마케팅 정보 수신 동의
      </PolicyItem>
    </div>
  );
}
