'use client';

import { UploadImage } from '../types/image';
import { useImageSelector } from './useImageSelector';
import { useImageUploader } from './useImageUploader';
import { useCallback } from 'react';

/**
 * 이미지 선택 + 즉시 업로드까지 관리하는 통합 훅.
 */
export function useImageManager() {
  const { inputRef, images, setImages, openPicker, handleSelect, handleRemove, handleReorder } =
    useImageSelector();

  const { uploadImages } = useImageUploader();

  /** 파일 선택 시 → 로컬 추가 후 → 자동 업로드 */
  const handleSelectAndUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      // 1) selector 로직으로 preview + pending 추가
      const newlySelected: UploadImage[] = handleSelect(e);
      if (newlySelected.length === 0) return;

      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] 선택한 파일:', newlySelected);
      }

      // 2) 방금 추가된 이미지들만 업로드
      const uploadedChunk = await uploadImages(newlySelected, (progressChunk) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[DEV] 업로드 진행 중:', progressChunk);
        }

        // progressChunk = 해당 batch의 이미지들만 업데이트됨
        setImages((prev) =>
          prev.map((img) => {
            const updated = progressChunk.find((u) => u.id === img.id);
            return updated ? { ...img, ...updated, preview: img.preview } : img;
          }),
        );
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] 업로드 완료:', uploadedChunk);
      }

      // 3) 업로드 완료 반영
      setImages((prev) =>
        prev.map((img) => {
          const updated = uploadedChunk.find((u) => u.id === img.id);
          return updated ? { ...img, ...updated, preview: img.preview } : img;
        }),
      );
    },
    [handleSelect, uploadImages, setImages],
  );

  return {
    inputRef,
    images,
    openPicker,
    handleSelectAndUpload,
    handleRemove,
    handleReorder,
  };
}
