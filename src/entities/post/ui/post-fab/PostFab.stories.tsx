import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PostFab } from './PostFab';

const meta = {
  title: 'Entities/UI/Post/PostFab',
  component: PostFab,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '게시글 작성 트리거용 아이콘 버튼',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    onClick: {
      description: '버튼 클릭 시 호출되는 콜백',
      action: 'clicked',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof PostFab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithClickAction: Story = {
  name: 'With click action',
  args: {
    onClick: () => {
      alert('PostFab 클릭!');
    },
  },
  parameters: {
    docs: {
      description: {
        story: '버튼 클릭 시 alert를 띄우는 예시입니다.',
      },
    },
  },
};
