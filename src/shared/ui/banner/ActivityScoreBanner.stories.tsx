import type { Meta, StoryObj } from '@storybook/nextjs';
import { ActivityScoreBanner } from './ActivityScoreBanner';

const meta: Meta<typeof ActivityScoreBanner> = {
  title: 'Shared/UI/ActivityScoreBanner',
  component: ActivityScoreBanner,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    part: {
      control: 'select',
      options: ['frontend', 'backend', 'design', 'data-analysis', 'deep-learning'],
    },
    score: {
      control: { type: 'number', min: 0, max: 100 },
    },
    onClickMore: { action: 'clicked' },
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-[40rem] min-w-[20rem]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ActivityScoreBanner>;

// 기본 템플릿
export const Default: Story = {
  args: {
    part: 'frontend',
    score: 75,
  },
};

// 각 파트별 스토리
export const Frontend: Story = {
  args: {
    part: 'frontend',
    score: 80,
  },
};

export const Backend: Story = {
  args: {
    part: 'backend',
    score: 65,
  },
};

export const Design: Story = {
  args: {
    part: 'design',
    score: 90,
  },
};

export const DataAnalysis: Story = {
  args: {
    part: 'data-analysis',
    score: 70,
  },
};

export const DeepLearning: Story = {
  args: {
    part: 'deep-learning',
    score: 95,
  },
};
