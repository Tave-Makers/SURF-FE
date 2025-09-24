import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Shared/UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    index: { control: 'number' },
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    renderTitle: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    index: 1,
    title: '기본 아코디언',
    defaultOpen: false,
    children: <p>이곳에 아코디언 내용이 표시됩니다.</p>,
  },
};

export const Opened: Story = {
  args: {
    index: 2,
    title: '처음부터 열림',
    defaultOpen: true,
    children: (
      <div>
        <p>열린 상태로 렌더링되는 아코디언입니다.</p>
        <p>스크롤 높이를 계산해서 transition이 적용돼요.</p>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    index: 3,
    title: '비활성화된 아코디언',
    isDisabled: true,
    children: <p>버튼을 눌러도 열리거나 닫히지 않습니다.</p>,
  },
};

export const CustomTitle: Story = {
  args: {
    index: 4,
    title: '커스텀 타이틀',
    renderTitle: (index, title) => (
      <span>
        <strong>{title}</strong> <em>({index})</em>
      </span>
    ),
    children: <p>renderTitle prop을 통해 타이틀을 커스터마이징할 수 있어요.</p>,
  },
};
