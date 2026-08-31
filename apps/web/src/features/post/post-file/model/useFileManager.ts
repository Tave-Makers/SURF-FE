'use client';

import { safeUUID, UploadFile } from '@surf/utils';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useCallback, useRef, useState } from 'react';
import { useFileUploader } from '@/entities/post/post-file/model/useFileUploader';
import { describeFailedNames } from '@/shared/lib/describeUploadFailure';

type UseFileManagerProps = {
  initialFiles?: UploadFile[];
};

export function useFileManager({ initialFiles = [] }: UseFileManagerProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>(initialFiles);
  const { uploadFiles } = useFileUploader();
  const showToast = useToastStore((s) => s.show);

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

        // 개별 PUT 실패는 예외로 올라오지 않고 status 로만 표시된다
        const failed = uploaded.filter((f) => f.status === 'error');
        if (failed.length > 0) {
          showToast(
            `${describeFailedNames(
              failed.map((f) => f.originalFileName),
              '파일',
            )} 업로드에 실패했어요. 삭제 후 다시 첨부해주세요.`,
          );
        }
      } catch (err) {
        console.error('파일 업로드 중 오류 발생', err);

        // presigned 발급 단계에서 터지면 'pending' 으로 남아 실패가 화면에 드러나지 않는다
        applyUploadedState(newlySelected.map((f) => ({ ...f, status: 'error' as const })));
        showToast(
          `${describeFailedNames(
            newlySelected.map((f) => f.originalFileName),
            '파일',
          )} 업로드에 실패했어요. 잠시 후 다시 시도해주세요.`,
        );
      }
    },
    [uploadFiles, applyUploadedState, showToast],
  );

  return {
    inputRef,
    files,
    openPicker,
    handleSelectAndUpload,
    handleRemove,
  };
}
