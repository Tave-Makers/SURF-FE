'use client';

import { useRef } from 'react';
import { useOnboardingStore } from '@/entities/user/model/onboardingStore';

export const ProfileImageUploader = () => {
  const { data, updateData } = useOnboardingStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateData({ profileImage: file });
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  // 선택된 이미지 파일로 미리보기 URL 생성
  const previewUrl = data.profileImage
    ? URL.createObjectURL(data.profileImage)
    : '/default-profile.png'; // 기본 이미지 경로

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
        className="bg-background-tag-purple focus:outline-none"
      />

      <button onClick={handleImageClick}>
        <img
          src={previewUrl}
          alt="프로필 이미지 선택"
          // alt는 프로필 컴포넌트로 바꿔야 함
          className="aspect-square h-[6rem] w-[6rem] object-cover focus:outline-none"
        />
      </button>
    </div>
  );
};
