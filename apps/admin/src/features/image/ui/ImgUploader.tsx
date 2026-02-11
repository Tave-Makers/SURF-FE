'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DEFAULT_IMAGE from '@/shared/assets/images/default-item.png';

type Mode = 'create' | 'edit';

type Props = {
  mode: Mode; // 생성/수정 모드
  value?: string; // 수정 모드에서 기존 이미지 URL
  onSelectFile: (file: File | null) => void; // 선택된 파일 부모에 전달
  isDisabled?: boolean;
  emptyText?: string; // create + 이미지 없을 때 노출 문구
  overlayText?: string; // edit + 이미지 위 오버레이 문구
};

export const ImgUploader = ({
  mode,
  value,
  onSelectFile,
  isDisabled,
  emptyText = '클릭하여 신규 이미지를 업로드 해주세요',
  overlayText = '이미지 변경',
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 로컬에서만 사용하는 파일/미리보기 상태
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  /**
   * 파일 선택 시 브라우저 objectURL 생성
   * - 컴포넌트 unmount or 파일 변경 시 revoke 처리
   */
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /**
   * 우선순위:
   * 1) 새로 선택한 preview
   * 2) 부모에서 내려준 value (edit 모드)
   * 3) edit 모드인데 아무것도 없으면 기본 이미지
   */
  const displayUrl = useMemo(() => {
    const previewOrValue = preview || value || '';
    return previewOrValue || (mode === 'edit' ? DEFAULT_IMAGE.src : '');
  }, [preview, value, mode]);

  const hasImage = Boolean(displayUrl);

  // 생성 모드 - 이미지 없을 때만 안내 문구 표시
  const showEmptyText = mode === 'create' && !hasImage;

  // 수정 모드 - 이미지 위 오버레이 표시
  const showOverlayText = mode === 'edit' && hasImage;

  const handlePick = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  /**
   * 파일 선택 시:
   * - 내부 state 업데이트
   * - 부모로 파일 전달 (업로드는 부모에서 처리)
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    setFile(next);
    onSelectFile(next);
    e.target.value = '';
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
        disabled={isDisabled}
      />

      <button
        type="button"
        onClick={handlePick}
        disabled={isDisabled}
        className="rounded-3 border-border-quaternary bg-background-quaternary text-foreground-quinary-darker text-caption-caption3 relative flex h-[9.375rem] w-full items-center justify-center overflow-hidden border border-dashed"
      >
        {hasImage ? (
          <>
            <img src={displayUrl} alt="banner" className="h-full w-full object-cover" />

            {/* 수정 모드 오버레이 */}
            {showOverlayText && (
              <div className="text-foreground-quinary-darker body-caption-caption3 absolute inset-0 flex items-center justify-center">
                {overlayText}
              </div>
            )}
          </>
        ) : showEmptyText ? (
          emptyText
        ) : null}
      </button>
    </div>
  );
};
