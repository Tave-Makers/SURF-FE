'use client';

import { UploadImage } from '@surf/utils';
import { useImageSelector, UseImageSelectorProps } from './useImageSelector';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { useCallback } from 'react';

/**
 * 이미지 선택 + 업로드를 관리하는 통합 훅.
 * UI 상태는 useImageSelector, 업로드는 useImageUploader,
 * 전체 이미지 비즈니스 로직은 useImageManager에서 조율.
 */
export function useImageManager({ initialImages = [] }: UseImageSelectorProps = {}) {
  // 1. useImageSelector에 초기값 전달
  const { inputRef, images, setImages, openPicker, handleSelect, handleRemove, handleReorder } =
    useImageSelector({ initialImages });

  const { uploadImages } = useImageUploader();

  /**
   * 업로드 결과를 현재 이미지 배열에 반영하는 공통 함수
   */
  const applyUploadedState = useCallback(
    (batch: UploadImage[]) => {
      setImages((prev) =>
        prev.map((img) => {
          const updated = batch.find((u) => u.id === img.id);
          return updated ? { ...img, ...updated, preview: img.preview ?? updated.preview } : img;
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

      try {
        // 업로드 진행 중 상태 반영
        const uploadedChunk = await uploadImages(newlySelected, (progressChunk) => {
          applyUploadedState(progressChunk);
        });

        // 최종 완료 상태 반영
        applyUploadedState(uploadedChunk);
      } catch (err) {
        console.error('이미지 업로드 중 오류 발생', err);

        // presigned 발급 단계에서 터지면 'pending' 으로 남는다.
        // 그대로 두면 업로드가 끝나지 않은 것으로 보여 등록 버튼이 영구히 잠긴다.
        applyUploadedState(newlySelected.map((img) => ({ ...img, status: 'error' as const })));
      }
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
