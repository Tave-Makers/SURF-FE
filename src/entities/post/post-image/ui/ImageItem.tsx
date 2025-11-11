'use client';
import DeleteIcon from '@/shared/assets/icons/post/post-image/x-circle-fill.svg';
import { useEffect, useMemo } from 'react';

type ImageItemProps = {
  file: File; // 업로드된 이미지 파일 객체
  onRemove?: () => void; // 삭제 버튼 클릭 핸들러
};

/**
 * 개별 이미지 썸네일 컴포넌트
 *
 * 역할:
 * - 이미지 미리보기 표시
 * - 삭제 버튼 제공
 */

export function ImageItem({ file, onRemove }: ImageItemProps) {
  // Object URL을 메모이제이션하여 불필요한 재생성 방지
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  // 컴포넌트 언마운트 또는 파일 변경 시 Object URL 정리
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="relative h-20 w-20 overflow-visible">
      {/* 파일을 즉시 미리보기로 표시 */}
      <img src={previewUrl} alt="preview" className="h-full w-full rounded-md object-cover" />

      {/* 삭제 버튼 */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation(); // DnDKit으로 이벤트 버블링 방지
        }}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full bg-black text-xs text-white"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
