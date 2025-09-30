import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { TextArea, type TextAreaProps } from './TextArea';

function ControlledTextArea(
  props: Omit<TextAreaProps, 'value' | 'onChange'> & { initialValue?: string },
) {
  const [val, setVal] = useState(props.initialValue ?? '');
  return <TextArea {...props} value={val} onChange={setVal} />;
}

const meta = {
  title: 'Shared/UI/TextArea',
  component: ControlledTextArea,
  tags: ['autodocs'],

  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['oneLine', 'multiLine'],
      description: '입력 모드',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder 문구',
    },
    isDisabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    textLimit: {
      control: { type: 'number', min: 0, step: 1 },
      description: '최대 글자 수 (미설정 시 무제한)',
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
} satisfies Meta<typeof ControlledTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GuideMessage: Story = {
  args: {
    mode: 'multiLine',
    placeholder: '내용을 입력하세요',
    isDisabled: false,
    textLimit: undefined,
    guideMessage: '가이드 메시지를 표시할 수 있어요.',
    errorMessage: '',
  },
};

export const OneLine: Story = {
  name: 'One line',
  args: {
    mode: 'oneLine',
    placeholder: '한 줄로 입력됩니다',
    textLimit: 40,
  },
};

export const MultiLine: Story = {
  name: 'Multi line',
  args: {
    mode: 'multiLine',
    placeholder: '여러 줄로 입력됩니다',
    textLimit: 200,
  },
};

export const WithLimit: Story = {
  name: 'With text limit',
  args: {
    mode: 'multiLine',
    placeholder: '최대 글자 수를 초과하지 않도록 제한',
    textLimit: 20,
  },
};

export const Disabled: Story = {
  args: {
    mode: 'multiLine',
    placeholder: '비활성화 상태',
    isDisabled: true,
    initialValue: '수정할 수 없습니다',
  },
};
