'use client';
import DeleteIcon from '@/shared/assets/icons/post/post-image/x-circle-fill.svg';
import { useEffect, useState } from 'react';

type ImageItemProps = {
  file: File; // 업로드된 이미지 파일 객체
  onRemove?: () => void; // 삭제 버튼 클릭 핸들러
};

/**
 * 개별 이미지 파일을 썸네일로 표시하고, 삭제 버튼을 통해 제거할 수 있는 컴포넌트
 *
 * @param {File} props.file - 미리보기로 표시할 업로드된 이미지 파일 객체.
 * @param {() => void} [props.onRemove] - 삭제 버튼 클릭 시 호출되는 콜백 함수 (선택적)
 */

export function ImageItem({ file, onRemove }: ImageItemProps) {
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // 언마운트될 때만 revoke (렌더 중복 방지)
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="relative h-20 w-20 overflow-visible">
      {/* 파일을 즉시 미리보기로 표시 */}
      <img
        src={previewUrl}
        alt={`${file.name} 미리보기`}
        draggable={false}
        className="h-full w-full rounded-md object-cover"
      />

      {/* 삭제 버튼 */}
      <button
        type="button"
        aria-label="이미지 삭제"
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
