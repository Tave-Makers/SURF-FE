import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Shared/UI/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    textLimit: { control: 'number' },
    isDisabled: { control: 'boolean' },
    isOneLine: { control: 'boolean' },
    errorMessage: { control: 'text' },
    guideMessage: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const WithLimit: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return <TextArea {...args} value={value} onChange={(val) => setValue(val)} />;
  },
  args: {
    placeholder: '내용을 입력하세요',
    isDisabled: false,
    isOneLine: false,
    textLimit: 100,
    errorMessage: '',
    guideMessage: '',
  },
};

export const OneLine: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextArea {...args} isOneLine value={value} onChange={(val) => setValue(val)} />;
  },
  args: {
    placeholder: '한 줄만 입력 가능',
    guideMessage: '한 줄만 입력 가능',
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('텍스트');
    return <TextArea {...args} value={value} onChange={(val) => setValue(val)} />;
  },
  args: {
    placeholder: '내용 입력',
    errorMessage: '필수 입력 항목입니다.',
  },
};
