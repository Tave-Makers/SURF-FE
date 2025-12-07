'use client';

import { useEffect, useRef, useState } from 'react';
import { reorderArray } from '@/shared/utils/reorder';
import { UploadImage } from '@/entities/image/model/types';
import { safeUUID } from '@/shared/utils/uuid';

/**
 * 이미지 선택 및 로컬 미리보기, 순서 변경을 담당하는 훅.
 * - File → preview URL 생성
 * - 이미지 추가/삭제/재정렬
 *
 * 서버 업로드와는 무관하며 순수하게 클라이언트 UI 상태만 관리한다.
 */
export function useImageSelector() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadImage[]>([]);

  /** 파일 선택창 열기 */
  const openPicker = () => inputRef.current?.click();

  /** 파일 선택 시 File 객체와 preview URL 생성 */
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return [];

    const selected = Array.from(e.target.files).map((file) => ({
      id: safeUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }));

    setImages((prev) => [...prev, ...selected]);
    e.target.value = '';

    return selected;
  };

  /** 이미지 삭제 및 preview URL 정리 */
  const handleRemove = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  /** 드래그 앤 드롭용 순서 변경 */
  const handleReorder = (from: number, to: number) => {
    setImages((prev) => reorderArray(prev, from, to));
  };

  const imagesRef = useRef<UploadImage[]>([]);

  /** 최신 images를 ref에 보관 */
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  /** 언마운트 시 preview URL 정리 */
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, []);

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
