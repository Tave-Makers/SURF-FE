'use client';

import { useRef, useState, useEffect } from 'react';
import { reorderArray } from '../utils/reorder';
import { ImageData } from '@/shared/types/image';

export function useImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageData[]>([]);

  const openPicker = () => inputRef.current?.click();

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
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

  // 전체 preview URL 정리 (unmount 시)
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return {
    inputRef,
    images,
    openPicker,
    handleSelect,
    handleRemove,
    handleReorder,
  };
}
