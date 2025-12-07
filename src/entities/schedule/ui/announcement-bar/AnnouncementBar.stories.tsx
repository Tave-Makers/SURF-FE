import type { Meta, StoryObj } from '@storybook/nextjs';
import { AnnouncementBar } from './AnnouncementBar';
import type { ActivityCategory } from '@/entities/calendar/model/types';

const CATEGORY_OPTIONS: ActivityCategory[] = ['official', 'operation', 'other'];

const meta: Meta<typeof AnnouncementBar> = {
  title: 'Entities/UI/Schedule/AnnouncementBar',
  component: AnnouncementBar,
  tags: ['autodocs'],

  argTypes: {
    category: {
      control: 'select',
      options: CATEGORY_OPTIONS,
    },
    date: { control: 'date' },
    title: { control: 'text' },
  },

  decorators: [
    (Story, context) => {
      const dateArg = context.args.date;

      if (!(dateArg instanceof Date)) {
        context.args.date = new Date(dateArg);
      }

      return <Story {...context} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof AnnouncementBar>;

export const Default: Story = {
  args: {
    title: '후반기 만남의 장 공지',
    date: new Date(),
    category: 'official',
  },
};
