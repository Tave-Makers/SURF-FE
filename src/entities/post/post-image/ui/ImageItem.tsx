'use client';
import DeleteIcon from '@/shared/assets/icons/post/post-image/x-circle-fill.svg';

type ImageItemProps = {
  preview: string;
  onRemove?: () => void;
};

export function ImageItem({ preview, onRemove }: ImageItemProps) {
  return (
    <div className="relative h-20 w-20 overflow-visible">
      <img
        src={preview}
        alt="이미지 미리보기"
        draggable={false}
        className="rounded-2 h-full w-full object-cover"
      />

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
