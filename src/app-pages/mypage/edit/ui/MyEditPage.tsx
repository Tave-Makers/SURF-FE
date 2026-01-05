'use client';

import { useRef, useState } from 'react';
import type { UserProfile } from '@/entities/user/model/types';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import {
  EditProfileForm,
  type EditProfileFormHandle,
} from '@/features/profile/edit-profile/ui/EditProfileForm';

interface Props {
  initialProfile: UserProfile;
}

export function MyEditPage({ initialProfile }: Props) {
  const formRef = useRef<EditProfileFormHandle>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '프로필 수정',
          hasLeftIcon: true,
          text: '저장',
          btnVariant: 'secondary',
          isDisabled: !canSubmit,
          onClickTextBtn: () => formRef.current?.submit(),
        }}
      />

      <EditProfileForm
        ref={formRef}
        initialProfile={initialProfile}
        onCanSubmitChange={setCanSubmit}
      />
    </div>
  );
}
