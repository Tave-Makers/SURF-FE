'use client';

import { useRef, useState } from 'react';
import { reorderArray } from '../utils/reorder';
import { UploadImage } from '@/shared/types/image';

export function useImageSelector() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadImage[]>([]);

  const openPicker = () => inputRef.current?.click();

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }));
    setImages((prev) => [...prev, ...selected]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleReorder = (from: number, to: number) => {
    setImages((prev) => reorderArray(prev, from, to));
  };

  return {
    inputRef,
    images,
    setImages,
    openPicker,
    handleSelect,
    handleRemove,
    handleReorder,
  };
}
