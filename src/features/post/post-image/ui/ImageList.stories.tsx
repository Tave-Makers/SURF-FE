import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
 * 실제 업로드 / 삭제 / 드래그 모두 가능한 스토리
 */
export const Default: Story = {
  render: () => (
    <div className="w-[360px]">
      <ImageList />
    </div>
  ),
};
