'use client';

import { useRef, useEffect, useState } from 'react';
import { useOnboardingStore } from '@/entities/user/model/onboardingStore';
import { ProfileImage } from '@/shared/ui/profile-image/ProfileImage';

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
  const [previewUrl, setPreviewUrl] = useState('');
  useEffect(() => {
    if (!data.profileImage) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(data.profileImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [data.profileImage]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
        className="focus:outline-none"
      />

      <button onClick={handleImageClick}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="선택한 프로필 이미지"
            className="aspect-square h-[6rem] w-[6rem] rounded-[0.5rem] object-cover focus:outline-none"
          />
        ) : (
          <ProfileImage size="xl" />
        )}
      </button>
    </div>
  );
};
