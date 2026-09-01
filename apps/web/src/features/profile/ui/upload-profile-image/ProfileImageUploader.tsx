'use client';

import { Avatar, AvatarSize } from '@surf/ui/avatar';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useMemo, useRef, useEffect, memo } from 'react';
import { validateProfileImage } from '@/features/profile/lib/validateProfileImage';

type Props = {
  file?: File;
  initialImageUrl?: string;
  onChange: (file: File) => void;
  imageSize?: AvatarSize;
};

const ProfileImageUploaderComponent = ({
  file,
  initialImageUrl,
  onChange,
  imageSize = 'xl',
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((s) => s.show);

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
      if (error instanceof Error) showToast(error.message);
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
        <Avatar src={displayImageUrl} size={imageSize} />
      </button>
    </>
  );
};

export const ProfileImageUploader = memo(ProfileImageUploaderComponent);
