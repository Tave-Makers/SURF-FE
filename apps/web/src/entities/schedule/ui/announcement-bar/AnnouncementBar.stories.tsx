import type { Meta, StoryObj } from '@storybook/nextjs';
import { AnnouncementBar } from './AnnouncementBar';
import type { ActivityCategory } from '@/entities/calendar/model/types';

const CATEGORY_OPTIONS: ActivityCategory[] = ['regular', 'operation', 'other'];

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
