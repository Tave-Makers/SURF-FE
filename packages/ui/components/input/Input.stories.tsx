import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Input, type InputProps } from './Input';
import { SurfIcon } from '../icon/SurfIcon';

function ControlledInput(
  props: Omit<InputProps, 'value' | 'onChange'> & { initialValue?: string },
) {
  const [val, setVal] = useState(props.initialValue ?? '');
  return <Input {...props} value={val} onChange={setVal} />;
}

const meta = {
  title: 'Shared/UI/Input',
  component: ControlledInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'],
      description: '입력 타입',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder 문구',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용 여부',
    },
    guideMessage: {
      control: 'text',
      description: '가이드 메시지',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
  },
} satisfies Meta<typeof ControlledInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '내용을 입력하세요',
  },
};

export const GuideMessage: Story = {
  args: {
    type: 'text',
    placeholder: '가이드 메시지가 표시됩니다',
    guideMessage: '영문, 숫자 조합 8자 이상',
  },
};

export const ErrorMessage: Story = {
  args: {
    type: 'text',
    placeholder: '에러 상태',
    errorMessage: '필수 입력 항목입니다.',
  },
};

export const WithIcon: Story = {
  render: (args) => <ControlledInput {...args} icon={<SurfIcon name="Search" size="m" />} />,
  args: {
    type: 'search',
    placeholder: '검색어를 입력하세요',
  },
};

export const WithLeadingTrailing: Story = {
  render: (args) => (
    <ControlledInput
      {...args}
      leading={<span className="text-body-body9 text-foreground-tertiary">₩</span>}
      trailing={<span className="text-body-body9 text-foreground-tertiary">원</span>}
    />
  ),
  args: {
    type: 'number',
    placeholder: '금액',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    disabled: true,
    initialValue: '수정할 수 없습니다',
  },
};

export const ReadOnly: Story = {
  args: {
    type: 'text',
    readOnly: true,
    initialValue: '읽기 전용',
  },
};
