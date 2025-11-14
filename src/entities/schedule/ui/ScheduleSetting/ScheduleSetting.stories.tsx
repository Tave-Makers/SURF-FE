import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScheduleSetting } from './ScheduleSetting';

export default {
  title: 'Entities/UI/Schedule/ScheduleSetting',
  component: ScheduleSetting,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[23.43rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleSetting>;

type Story = StoryObj<typeof ScheduleSetting>;

export const Start: Story = {
  args: {
    title: '시작',
    date: new Date('2025-11-12T14:30:00'),
  },
};

export const End: Story = {
  args: {
    title: '종료',
    date: new Date('2025-11-12T18:00:00'),
  },
};

export const Now: Story = {
  args: {
    title: '시작',
    date: new Date(),
  },
};
