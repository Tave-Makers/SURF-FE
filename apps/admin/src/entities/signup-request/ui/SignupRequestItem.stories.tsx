import type { Meta, StoryObj } from '@storybook/nextjs';
import { SignupRequestItem } from './SignupRequestItem';

const meta: Meta<typeof SignupRequestItem> = {
  title: 'Entities/UI/SignupRequest/SignupRequestItem',
  component: SignupRequestItem,
  args: {
    name: 'Tavee',
    university: '서울대학교',
    tracks: [
      { generation: 15, part: 'DESIGN' },
      { generation: 16, part: 'WEB_FRONTEND' },
    ],
    registeredAt: '25.06.30 12:12',
    status: 'waiting',
    checked: false,
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['waiting', 'approve', 'reject'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SignupRequestItem>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Approved: Story = {
  args: {
    status: 'approve',
  },
};

export const Rejected: Story = {
  args: {
    status: 'reject',
  },
};
