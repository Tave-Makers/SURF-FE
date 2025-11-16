import type { Meta, StoryObj } from '@storybook/nextjs';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Shared/UI/Accordion/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    title: '기본 아코디언',
    children: <p>내부에는 children이 들어갑니다.</p>,
  },
};

export const WithIndex: Story = {
  args: {
    index: 1,
    title: '넘버링 아코디언',
    children: <p>index가 있으면 번호가 붙습니다.</p>,
  },
};

export const WithoutIndex: Story = {
  args: {
    title: '넘버링 제외 아코디언',
    children: <p>index를 주지 않으면 번호가 없습니다.</p>,
  },
};

export const CustomTitle: Story = {
  args: {
    index: 3,
    title: '커스텀 타이틀 아코디언',
    renderTitle: (index, title) => (
      <span>
        [{index}] {title}
      </span>
    ),
    children: <p>renderTitle prop을 통해 커스텀 타이틀을 적용할 수 있습니다.</p>,
  },
};
