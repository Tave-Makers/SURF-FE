'use client';

import { useMemo, useRef, useEffect } from 'react';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { validateProfileImage } from '@/features/profile/lib/validateProfileImage';

type Props = {
  file?: File;
  initialImageUrl?: string;
  onChange: (file: File) => void;
};

export const ProfileImageUploader = ({ file, initialImageUrl, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    try {
      await validateProfileImage(selected);
      onChange(selected);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      e.target.value = '';
    }
  };

  const displayImageUrl = previewUrl ?? initialImageUrl;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => void handleImageChange(e)}
        hidden
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        <Avatar src={displayImageUrl} size="xl" />
      </button>
    </>
  );
};
