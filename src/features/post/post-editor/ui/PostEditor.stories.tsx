import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostEditor } from './PostEditor';

// Storybook 메타데이터 설정
const meta: Meta<typeof PostEditor> = {
  title: 'Features/UI/Post/PostEditor/PostEditor',
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
  args: {
    initialContent: `<p>이곳에 게시글을 작성하세요 ✍️</p>`,
  },
};

// 빈 에디터 (Placeholder 확인용)
export const Empty: Story = {
  args: {
    initialContent: '',
  },
};
