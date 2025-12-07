import type { Meta, StoryObj } from '@storybook/nextjs';
import { Shortcut } from './Shortcut';

const meta: Meta<typeof Shortcut> = {
  title: 'Entities/Shortcut',
  component: Shortcut,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'lightgray',
      values: [
        { name: 'lightgray', value: '#f3f3f3' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['circle', 'rectangle'],
    },
    label: { control: 'text' },
    image: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Shortcut>;

export const Circle: Story = {
  args: {
    type: 'circle',
    label: 'Label',
    image: '',
  },
};

export const Rectangle: Story = {
  args: {
    type: 'rectangle',
    label: 'Label',
    image: '',
  },
};
