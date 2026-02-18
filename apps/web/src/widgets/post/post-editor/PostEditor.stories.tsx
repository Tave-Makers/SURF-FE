import type { Meta, StoryObj } from '@storybook/nextjs';
import { UploadImage } from '@surf/utils';
import { PostEditor } from './PostEditor';

const meta: Meta<typeof PostEditor> = {
  title: 'Widgets/UI/Post/PostEditor/PostEditor',
  component: PostEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostEditor>;

// 공통 mock handlers
const onChangeMock = (data: { content: string; images: UploadImage[] }) => {
  console.log('onChange', data);
};

// 기본 예시
export const Default: Story = {
  render: (args) => (
    <div className="mx-auto flex h-[300px] w-[min(100dvw,calc(100dvh*375/812))] overflow-hidden border border-[#e0e0e0]">
      <PostEditor {...args} />
    </div>
  ),
  args: {
    mode: 'create',
    initialContent: `<p>이곳에 게시글을 작성하세요 ✍️</p>`,
    initialImages: [],
    onChange: onChangeMock,
  },
};

// 빈 에디터
export const Empty: Story = {
  render: (args) => (
    <div className="mx-auto flex h-[300px] w-[min(100dvw,calc(100dvh*375/812))] overflow-hidden border border-[#e0e0e0]">
      <PostEditor {...args} />
    </div>
  ),
  args: {
    mode: 'create',
    initialContent: '',
    initialImages: [],
    onChange: onChangeMock,
  },
};
