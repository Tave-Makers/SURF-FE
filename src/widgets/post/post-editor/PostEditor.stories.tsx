import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostEditor } from './PostEditor';
import { UploadImage } from '@/entities/image/model/types';

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

// 공통 mock handlers
const onChangeMock = (data: { content: string; images: UploadImage[] }) => {
  console.log('onChange', data);
};

const onInitializedMock = () => {
  console.log('PostEditor initialized');
};

// 기본 예시
export const Default: Story = {
  render: (args) => (
    <div className="mx-auto flex h-[300px] w-[360px] overflow-hidden border border-[#e0e0e0]">
      <PostEditor {...args} />
    </div>
  ),
  args: {
    initialContent: `<p>이곳에 게시글을 작성하세요 ✍️</p>`,
    initialImages: [],
    onChange: onChangeMock,
    onInitialized: onInitializedMock,
  },
};

// 빈 에디터
export const Empty: Story = {
  render: (args) => (
    <div className="mx-auto flex h-[300px] w-[360px] overflow-hidden border border-[#e0e0e0]">
      <PostEditor {...args} />
    </div>
  ),
  args: {
    initialContent: '',
    initialImages: [],
    onChange: onChangeMock,
    onInitialized: onInitializedMock,
  },
};
