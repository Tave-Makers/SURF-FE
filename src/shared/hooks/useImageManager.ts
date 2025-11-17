'use client';

import { UploadImage } from '../types/image';
import { useImageSelector } from './useImageSelector';
import { useImageUploader } from './useImageUploader';
import { useCallback } from 'react';

/**
 * 이미지 선택 + 업로드를 관리하는 통합 훅.
 * UI 상태는 useImageSelector, 업로드는 useImageUploader,
 * 전체 이미지 비즈니스 로직은 useImageManager에서 조율.
 */
export function useImageManager() {
  const { inputRef, images, setImages, openPicker, handleSelect, handleRemove, handleReorder } =
    useImageSelector();

  const { uploadImages } = useImageUploader();

  /**
   * 업로드 결과를 현재 이미지 배열에 반영하는 공통 함수
   * (progress + 완료에 모두 사용)
   */
  const applyUploadedState = useCallback(
    (batch: UploadImage[]) => {
      setImages((prev) =>
        prev.map((img) => {
          const updated = batch.find((u) => u.id === img.id);
          // preview는 유지해야 하므로 preview 우선
          return updated ? { ...img, ...updated, preview: img.preview } : img;
        }),
      );
    },
    [setImages],
  );

  /**
   * 파일 선택 시 즉시 업로드 로직
   */
  const handleSelectAndUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newlySelected = handleSelect(e);
      if (newlySelected.length === 0) return;

      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] 파일 선택됨:', newlySelected);
      }

      const uploadedChunk = await uploadImages(newlySelected, (progressChunk) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[DEV] 업로드 진행 중:', progressChunk);
        }
        applyUploadedState(progressChunk);
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] 업로드 완료:', uploadedChunk);
      }

      applyUploadedState(uploadedChunk);
    },
    [handleSelect, uploadImages, applyUploadedState],
  );

  return {
    inputRef,
    images,
    setImages,
    openPicker,
    handleSelectAndUpload,
    handleRemove,
    handleReorder,
  };
}
