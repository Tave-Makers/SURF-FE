'use client';

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
  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-md">
      {/* 파일을 즉시 미리보기로 표시 */}
      <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />

      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white"
      >
        ✕
      </button>
    </div>
  );
}
