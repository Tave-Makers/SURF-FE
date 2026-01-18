import type { Meta, StoryObj } from '@storybook/nextjs';
import { ScheduleCategory } from '../../model/types';
import { AnnouncementBar } from './AnnouncementBar';

const CATEGORY_OPTIONS: ScheduleCategory[] = ['regular', 'operation', 'other'];

const meta: Meta<typeof AnnouncementBar> = {
  title: 'Entities/UI/Schedule/AnnouncementBar',
  component: AnnouncementBar,
  tags: ['autodocs'],

  argTypes: {
    category: {
      control: 'select',
      options: CATEGORY_OPTIONS,
    },
    date: { control: 'text' },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AnnouncementBar>;

export const Default: Story = {
  args: {
    title: '후반기 만남의 장 공지',
    date: '12.31',
    category: 'regular',
  },
};
