'use client';

//import { useState } from 'react';
//import { ProfileEditHeader } from '@/widgets/profile-edit-header/ui/ProfileEditHeader';
//import { ProfileEditForm } from '@/widgets/profile-edit-form/ui/ProfileEditForm';
import { TextButton } from '@/shared/ui/text-button/TextButton';

export function MyEditPage() {
  //const [memberName] = useState('김테이비');

  const handleEdit = () => {
    // TODO: 편집 저장/전환 로직 또는 라우팅 연결
  };

  const handleAddCareer = () => {
    // TODO: 경력 필드 추가 로직
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col gap-[0.5rem] px-[1rem] py-[0.62rem]">
        <div className="flex w-[4rem] self-end">
          <TextButton size="s" variant="secondary" onClick={handleEdit}>
            삭제하기
          </TextButton>
        </div>
        <TextButton size="m" variant="secondary" onClick={handleAddCareer}>
          경력 추가하기
        </TextButton>
      </div>
    </div>
  );
}
