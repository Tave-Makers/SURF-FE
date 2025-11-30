'use client';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { ImageList } from './ImageList';
import { useImageSelector } from '@/shared/hooks/useImageSelector';

const meta: Meta<typeof ImageList> = {
  title: 'Entities/UI/Post/PostImage/ImageList',
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
    const { inputRef, images, openPicker, handleSelect, handleRemove, handleReorder } =
      useImageSelector();

    return (
      <div className="flex w-[360px] flex-col items-center gap-4 rounded-lg border border-gray-200 p-4">
        {/* 파일 업로드 버튼 */}
        <button
          type="button"
          className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300"
          onClick={openPicker}
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

        {/* 이미지 리스트 */}
        <ImageList images={images} onRemove={handleRemove} onReorder={handleReorder} />
      </div>
    );
  },
};
