import type { Meta, StoryObj } from '@storybook/nextjs';
import { Shortcut } from './Shortcut';

const meta: Meta<typeof Shortcut> = {
  title: 'Shared/UI/Shortcut',
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
    imageSrc: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Shortcut>;

export const Circle: Story = {
  args: {
    type: 'circle',
    label: 'Label',
    imageSrc:
      'https://product.mujikorea.co.kr/images/products/8809191730770/NEW/8809191730770.jpg?w=960&f=webp',
    onClick: () => alert('Circle shortcut 클릭됨'),
  },
};

export const Rectangle: Story = {
  args: {
    type: 'rectangle',
    label: 'Label',
    imageSrc:
      'https://product.mujikorea.co.kr/images/products/8809191730770/NEW/8809191730770.jpg?w=960&f=webp',
    onClick: () => alert('Rectangle shortcut 클릭됨'),
  },
};
