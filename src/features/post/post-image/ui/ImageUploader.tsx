'use client';

type ImageUploaderProps = {
  onSelect: (files: File[]) => void;
};

/**
 * 파일 업로드 input을 감싼 컴포넌트
 * 여러 장 업로드 가능 (image/*)
 */

export function ImageUploader({ onSelect }: ImageUploaderProps) {
  /** 파일 선택 핸들러 */
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const files = Array.from<File>(e.target.files);
    onSelect(files);
  };

  return (
    <label className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
      이미지 추가
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleSelect} />
    </label>
  );
}
