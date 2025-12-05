'use client';
import DeleteIcon from '@/shared/assets/icons/post/post-image/x-circle-fill.svg';
import { UploadImage } from '@/entities/image/model/types';

type ImageItemProps = {
  preview: string;
  uploadedUrl?: string;
  status: UploadImage['status'];
  onRemove?: () => void;
};

export function ImageItem({ preview, uploadedUrl, status, onRemove }: ImageItemProps) {
  const src = uploadedUrl ?? preview;

  return (
    <div className="relative h-20 w-20 overflow-visible">
      <img
        src={src}
        alt="이미지 미리보기"
        draggable={false}
        className="rounded-2 h-full w-full object-cover"
      />

      {status === 'error' && (
        <div
          role="alert"
          className="rounded-2 absolute inset-0 flex items-center justify-center bg-black/40 text-center text-xs text-white"
        >
          업로드
          <br />
          실패
        </div>
      )}

      {status === 'uploading' && (
        <div
          role="status"
          aria-live="polite"
          aria-label="이미지 업로드 중"
          className="rounded-2 absolute inset-0 flex items-center justify-center bg-black/20 text-white"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      )}

      <button
        type="button"
        aria-label="이미지 삭제"
        onPointerDown={(e) => e.stopPropagation()} // DnD 버블링 방지
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
