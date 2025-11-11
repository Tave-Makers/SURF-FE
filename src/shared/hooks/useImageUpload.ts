'use client';

import { useRef, useState } from 'react';

export function useImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const openPicker = () => inputRef.current?.click();

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
  };
}
