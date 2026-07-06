'use client';

import { SurfIcon } from '@surf/ui/icon';

type FileCardProps = {
  fileName: string;
  onRemove?: () => void;
};

export const FileCard = ({ fileName, onRemove }: FileCardProps) => {
  return (
    <div className="rounded-4 bg-background-normal border-border-quinary flex items-center gap-8 border px-13 py-11">
      <div className="min-w-0 flex-1">
        <p className="text-body-body6 text-foreground-tertiary truncate">{fileName}</p>
      </div>

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
