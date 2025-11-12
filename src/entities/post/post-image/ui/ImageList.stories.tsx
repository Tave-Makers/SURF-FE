import type { Meta, StoryObj } from '@storybook/nextjs';
import { useRef, useState } from 'react';
import { ImageList } from './ImageList';
import { reorderArray } from '../lib/reorder';

const meta: Meta<typeof ImageList> = {
  title: 'Entities/UI/PostImage/ImageList',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ImageList>;

/**
 * 외부 input으로 파일 선택 시 ImageList에 반영되는 스토리
 */
export const Default: Story = {
  render: () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    /** 파일 선택 */
    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    };

    /** 파일 삭제 */
    const handleRemove = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    /** 드래그 순서 변경 */
    const handleReorder = (from: number, to: number) => {
      setFiles((prev) => reorderArray(prev, from, to));
    };

    return (
      <div className="flex w-[360px] flex-col items-center gap-4 rounded-lg border border-gray-200 p-4">
        {/* 파일 업로드 버튼 */}
        <button
          type="button"
          className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300"
          onClick={() => inputRef.current?.click()}
        >
          이미지 추가
        </button>

        {/* 숨겨진 파일 input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelect}
        />

        {/* 렌더링 전용 ImageList */}
        <ImageList files={files} onRemove={handleRemove} onReorder={handleReorder} />
      </div>
    );
  },
};
