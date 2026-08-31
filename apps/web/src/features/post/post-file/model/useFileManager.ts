'use client';

import { safeUUID, UploadFile } from '@surf/utils';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useCallback, useRef, useState } from 'react';
import { useFileUploader } from '@/entities/post/post-file/model/useFileUploader';

type UseFileManagerProps = {
  initialFiles?: UploadFile[];
};

/** 토스트 뷰포트가 375px 로 묶여 있어, 긴 이름은 확장자만 남기고 줄인다 */
const MAX_TOAST_FILE_NAME = 20;

const MAX_EXTENSION_LENGTH = 10;

const shortenFileName = (name: string) => {
  if (name.length <= MAX_TOAST_FILE_NAME) return name;

  const lastDot = name.lastIndexOf('.');
  // 확장자로 보기 어려울 만큼 길면 그냥 이름의 일부로 취급한다
  const hasExtension = lastDot > 0 && name.length - lastDot <= MAX_EXTENSION_LENGTH;
  const ext = hasExtension ? name.slice(lastDot) : '';
  const base = hasExtension ? name.slice(0, lastDot) : name;

  return `${base.slice(0, MAX_TOAST_FILE_NAME - ext.length - 1)}…${ext}`;
};

/** 실패한 파일이 여러 개면 첫 이름만 보여주고 나머지는 개수로 접는다 */
const describeFailedFiles = (failed: UploadFile[]) => {
  const [first, ...rest] = failed;
  if (!first) return '파일';

  const name = shortenFileName(first.originalFileName);
  return rest.length > 0 ? `${name} 외 ${rest.length}개` : name;
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
            `${describeFailedFiles(failed)} 업로드에 실패했어요. 삭제 후 다시 첨부해주세요.`,
          );
        }
      } catch (err) {
        console.error('파일 업로드 중 오류 발생', err);

        // presigned 발급 단계에서 터지면 'pending' 으로 남아 실패가 화면에 드러나지 않는다
        applyUploadedState(newlySelected.map((f) => ({ ...f, status: 'error' as const })));
        showToast(
          `${describeFailedFiles(newlySelected)} 업로드에 실패했어요. 잠시 후 다시 시도해주세요.`,
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
