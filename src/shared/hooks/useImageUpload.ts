'use client';

import { useRef, useState } from 'react';
import { reorderArray } from '../utils/reorder';

export function useImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const openPicker = () => inputRef.current?.click();

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (from: number, to: number) => {
    setFiles((prev) => reorderArray(prev, from, to));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);
    e.target.value = '';
  };

  return {
    inputRef,
    files,
    openPicker,
    handleSelect,
    handleRemove,
    handleReorder,
  };
}
