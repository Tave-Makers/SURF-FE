import type { Meta, StoryObj } from '@storybook/nextjs';
import { SignupRequestItem } from './SignupRequestItem';

const meta: Meta<typeof SignupRequestItem> = {
  title: 'Entities/UI/SignupRequest/SignupRequestItem',
  component: SignupRequestItem,
  args: {
    name: 'Tavee',
    timestamp: '2025-01-15 16:32',
    infoTags: ['15기 디자인', '16기 프론트'],
    status: 'waiting',
    isChecked: false,
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
    isChecked: true,
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
