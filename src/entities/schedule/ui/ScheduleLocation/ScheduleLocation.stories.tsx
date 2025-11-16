import type { Meta, StoryObj } from '@storybook/nextjs';
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
    placeholder: '장소 입력',
    location: '강남역 메가박스 9층',
    onChange: (value: string) => {
      console.log('Location changed to:', value);
    },
  },
};

export const EmptyLocation: Story = {
  args: {
    title: '장소',
    placeholder: '장소 입력',
    location: undefined,
    onChange: (value: string) => {
      console.log('Location changed to:', value);
    },
  },
};

export const LongLocation: Story = {
  args: {
    title: '강의실',
    placeholder: '장소 입력',
    location: '서울특별시 강남구 테헤란로 231',
    onChange: (value: string) => {
      console.log('Location changed to:', value);
    },
  },
};
