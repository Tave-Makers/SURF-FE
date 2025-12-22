'use client';

import { useRef, useState } from 'react';
import { Avatar } from '@/shared/ui/avatar/Avatar';

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export const ProfileImageUploader = ({ value, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setPreviewUrl(url);
      onChange(url);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <button type="button" onClick={() => inputRef.current?.click()}>
        {previewUrl || value ? (
          <img
            src={previewUrl || value}
            alt="프로필 이미지"
            className="rounded-4 aspect-square h-[6rem] w-[6rem] object-cover"
          />
        ) : (
          <Avatar size="xl" />
        )}
      </button>
    </div>
  );
};
