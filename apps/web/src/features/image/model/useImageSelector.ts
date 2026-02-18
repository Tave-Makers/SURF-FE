'use client';

import { safeUUID, reorderArray } from '@surf/utils';
import { useEffect, useRef, useState } from 'react';
import { UploadImage } from '@surf/utils';

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

  /** 언마운트 시 preview URL 정리 (단, 업로드된 이미지는 유지) */
  useEffect(() => {
    return () => {
      // 로컬 preview URL만 revoke (파일 선택으로 생성된 것)
      // 서버에서 받은 이미지는 preview === uploadUrl이므로 유지됨
      imagesRef.current.forEach((img) => {
        // 파일이 있으면 로컬 preview -> revoke 안전
        // 파일이 없으면 서버 이미지 -> revoke 금지 (전역 스토어에서 여전히 사용중일 수 있음)
        if (img.preview && img.file) URL.revokeObjectURL(img.preview);
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
