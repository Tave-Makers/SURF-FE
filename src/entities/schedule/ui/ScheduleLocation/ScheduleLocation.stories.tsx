import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScheduleLocation } from './ScheduleLocation';

const meta = {
  title: 'Entities/UI/Schedule/ScheduleLocation',
  component: ScheduleLocation,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleLocation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '장소',
    location: '강남역 메가박스 9층',
  },
};

export const EmptyLocation: Story = {
  args: {
    title: '장소',
    location: undefined,
  },
};

export const LongLocation: Story = {
  args: {
    title: '강의실',
    location: '서울특별시 강남구 테헤란로 231',
  },
};
