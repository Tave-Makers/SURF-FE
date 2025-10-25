import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrapButton from './ScrapButton';

const meta: Meta<typeof ScrapButton> = {
  title: 'Shared/UI/ScrapButton',
  component: ScrapButton,
  tags: ['autodocs'],
  argTypes: {
    isScrapped: {
      control: 'boolean',
      description: '스크랩 상태 여부',
    },
    count: {
      control: 'number',
      description: '스크랩 개수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrapButton>;

// 🩶 기본 상태
export const Default: Story = {
  args: {
    isScrapped: false,
    count: 12,
  },
};

// 💙 스크랩된 상태
export const Scrapped: Story = {
  args: {
    isScrapped: true,
    count: 13,
  },
};

// 🧪 Playground (Storybook에서 prop 직접 조정 가능)
export const Playground: Story = {
  args: {
    isScrapped: false,
    count: 0,
  },
};
