'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Avatar } from '@/shared/ui/avatar/Avatar';

type Props = {
  file?: File;
  initialImageUrl?: string;
  onChange: (file: File) => void;
};

export const ProfileImageUploader = ({ file, initialImageUrl, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  /** File → preview URL */
  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  /** preview URL 메모리 해제 */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    onChange(selected);
  };

  const displayImageUrl = previewUrl ?? initialImageUrl;

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleImageChange} hidden />

      <button type="button" onClick={() => inputRef.current?.click()}>
        <Avatar src={displayImageUrl} size="xl" />
      </button>
    </div>
  );
};
