import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostEditor } from './PostEditor';

const meta: Meta<typeof PostEditor> = {
  title: 'Widgets/UI/Post/PostEditor/PostEditor',
  component: PostEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PostEditor>;

// 기본 예시 (기본 내용 포함)
export const Default: Story = {
  render: (args) => (
    <div
      style={{
        width: '360px',
        height: '300px',
        margin: '0 auto',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      <PostEditor {...args} />
    </div>
  ),
  args: {
    initialContent: `<p>이곳에 게시글을 작성하세요 ✍️</p>`,
  },
};

// 빈 에디터 (Placeholder 확인용)
export const Empty: Story = {
  render: (args) => (
    <div
      style={{
        width: '360px',
        height: '300px',
        margin: '0 auto',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      <PostEditor {...args} />
    </div>
  ),
  args: {
    initialContent: '',
  },
};
