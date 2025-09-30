'use client';

import { useState } from 'react';
import { Tab } from '@/shared/ui/tab/Tab';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { ActivityBadge } from '@/shared/ui/activity-badge/ActivityBadge';

export function ProfileTabs() {
  const [tab, setTab] = useState('profile');

  return (
    <>
      <Tab
        items={[
          { value: 'profile', label: '프로필' },
          { value: 'badges', label: '활동뱃지' },
        ]}
        value={tab}
        onValueChange={setTab}
      />
      <div className="flex flex-col">
        {tab === 'profile' ? (
          <div className="flex flex-col gap-[1.5rem] px-[1rem] py-[1.25rem]">
            <FieldGroup title="전화번호" isRequired>
              <TextArea value="010-1234-5678" onChange={() => {}} readOnly />
            </FieldGroup>
            <FieldGroup title="이메일" isRequired>
              <TextArea value="test@test.com" onChange={() => {}} readOnly />
            </FieldGroup>
            <FieldGroup title="학교" isRequired>
              <TextArea value="테이브대학교" onChange={() => {}} readOnly />
              <TextArea value="테이브대학교 대학원" onChange={() => {}} readOnly />
            </FieldGroup>
            <FieldGroup title="경력" isRequired>
              <TextArea value="테이브 개발자" onChange={() => {}} readOnly />
            </FieldGroup>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[3rem] p-[2.5rem]">
            <ActivityBadge badgeName="출석왕" timestamp="2025-09-18" />
            <ActivityBadge badgeName="출석왕" timestamp="2025-09-18" />
            <ActivityBadge badgeName="출석왕" timestamp="2025-09-18" />
            <ActivityBadge badgeName="출석왕" timestamp="2025-09-18" />
          </div>
        )}
      </div>
    </>
  );
}
