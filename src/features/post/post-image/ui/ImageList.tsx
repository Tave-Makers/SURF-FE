'use client';

import { useEffect, useState } from 'react';
import { ImageDnD } from './ImageDnD';
import { reorderArray } from '../lib/reorder';
import { ImageData } from '../model/types';

/**
 * 외부에서 전달된 파일 목록을 기반으로
 * 이미지 미리보기 / 삭제 / 드래그 기능을 제공하는 컴포넌트
 *
 * @param files 외부에서 전달된 File 배열 (예: input[type=file] 선택 결과)
 */

type ImageListProps = {
  files?: File[]; // 외부에서 전달받은 파일 배열
};

export function ImageList({ files }: ImageListProps) {
  const [images, setImages] = useState<ImageData[]>([]);

  /** 외부에서 files가 바뀔 때마다 내부 상태에 반영 */
  useEffect(() => {
    if (!files || files.length === 0) return;
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);

    // 메모리 누수 방지용 URL 해제
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [files]);

  /** 이미지 삭제 */
  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** 드래그 정렬 */
  const handleReorder = (from: number, to: number) => {
    setImages((prev) => reorderArray(prev, from, to));
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* 이미지 리스트 */}
      {images.length > 0 && (
        <ImageDnD images={images} onReorder={handleReorder} onRemove={handleRemove} />
      )}
    </div>
  );
}
