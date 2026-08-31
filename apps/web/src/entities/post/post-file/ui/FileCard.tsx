'use client';

import { SurfIcon } from '@surf/ui/icon';
import { UploadFile } from '@surf/utils';

type FileCardProps = {
  fileName: string;
  status?: UploadFile['status'];
  onRemove?: () => void;
};

export const FileCard = ({ fileName, status, onRemove }: FileCardProps) => {
  return (
    <div className="rounded-4 bg-background-normal border-border-quinary flex items-center gap-8 border px-13 py-11">
      <div className="min-w-0 flex-1">
        <p className="text-body-body6 text-foreground-tertiary truncate">{fileName}</p>
      </div>

      {status === 'error' && (
        <p role="alert" className="text-body-body6 text-foreground-danger shrink-0">
          업로드 실패
        </p>
      )}

      {status === 'uploading' && (
        <div
          role="status"
          aria-live="polite"
          aria-label="파일 업로드 중"
          className="border-foreground-tertiary h-14 w-14 shrink-0 animate-spin rounded-full border-2 border-t-transparent"
        />
      )}

      {onRemove && (
        <button
          type="button"
          aria-label="파일 삭제"
          onClick={onRemove}
          className="relative flex shrink-0 items-center justify-center"
        >
          <SurfIcon name="X" size="m" className="text-foreground-normal" />
          <span className="absolute -inset-4" />
        </button>
      )}
    </div>
  );
};
