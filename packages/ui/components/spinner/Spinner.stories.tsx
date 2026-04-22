import type { Meta, StoryObj } from '@storybook/nextjs';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Shared/UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 's',
    label: '로딩 중',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
      description: '스피너 크기',
    },
    label: {
      control: 'text',
      description: '접근성 라벨',
    },
    className: {
      control: 'text',
      description: '추가 스타일 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const SizeS: Story = {};

export const SizeM: Story = {
  args: {
    size: 'm',
  },
};

export const SizeL: Story = {
  args: {
    size: 'l',
  },
};
