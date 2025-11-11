import type { Meta, StoryObj } from '@storybook/nextjs';
import { useRef, useState } from 'react';
import { ImageList } from './ImageList';

const meta: Meta<typeof ImageList> = {
  title: 'Features/UI/PostImage/ImageList',
  component: ImageList,
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

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);
      setFiles(files);
    };

    return (
      <div className="flex w-[360px] flex-col items-center gap-4 border border-gray-200 p-4">
        {/* 파일 업로드 버튼 */}
        <button
          type="button"
          className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300"
          onClick={() => inputRef.current?.click()}
        >
          이미지 추가
        </button>

        {/* 숨겨진 input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelect}
        />

        {/* 파일 선택 시 즉시 반영 */}
        <ImageList files={files} />
      </div>
    );
  },
};
