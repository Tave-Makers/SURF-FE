'use client';

import { safeUUID, UploadFile } from '@surf/utils';
import { useCallback, useRef, useState } from 'react';
import { useFileUploader } from '@/entities/post/post-file/model/useFileUploader';

type UseFileManagerProps = {
  initialFiles?: UploadFile[];
};

export function useFileManager({ initialFiles = [] }: UseFileManagerProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>(initialFiles);
  const { uploadFiles } = useFileUploader();

  const openPicker = () => inputRef.current?.click();

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>): UploadFile[] => {
    if (!e.target.files) return [];

    const selected = Array.from(e.target.files).map((file) => ({
      id: safeUUID(),
      file,
      originalFileName: file.name,
      fileSize: file.size,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
    return selected;
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const applyUploadedState = useCallback((batch: UploadFile[]) => {
    setFiles((prev) =>
      prev.map((f) => {
        const updated = batch.find((u) => u.id === f.id);
        return updated ? { ...f, ...updated } : f;
      }),
    );
  }, []);

  const handleSelectAndUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newlySelected = handleSelect(e);
      if (newlySelected.length === 0) return;

      try {
        const uploaded = await uploadFiles(newlySelected, (progress) => {
          applyUploadedState(progress);
        });
        applyUploadedState(uploaded);
      } catch (err) {
        console.error('파일 업로드 중 오류 발생', err);
      }
    },
    [uploadFiles, applyUploadedState],
  );

  return {
    inputRef,
    files,
    openPicker,
    handleSelectAndUpload,
    handleRemove,
  };
}
