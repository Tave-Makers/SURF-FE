import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextInput from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Shared/UI/TextInput',
  component: TextInput,
  argTypes: {
    placeholder: { control: 'text' },
    hasIcon: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

/* SearchField (검색창) */
export const SearchField: Story = {
  render: (args) => {
    const [search, setSearch] = useState('');
    return (
      <div className="w-[19.56rem]">
        <TextInput
          {...args}
          mode="SearchField"
          value={search}
          onChange={setSearch}
          onSubmit={(val: string) => alert(`검색: ${val}`)}
        />
      </div>
    );
  },
  args: {
    hasIcon: true,
    placeholder: '검색어를 입력하세요',
  },
};

/* TextField (댓글 입력창) */
export const TextField: Story = {
  render: (args) => {
    const [comment, setComment] = useState('');
    return (
      <div className="w-[19.56rem]">
        <TextInput
          {...args}
          mode="TextField"
          value={comment}
          onChange={setComment}
          onClick={() => alert('아이콘 클릭됨')}
        />
      </div>
    );
  },
  args: {
    hasIcon: true,
    placeholder: '댓글을 입력하세요',
    isActive: false,
  },
};

/* Ref 사용 예시 (부모에서 포커스 제어) */
export const WithRef: Story = {
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [comment, setComment] = useState('');
    const [isActive, setIsActive] = useState(false);

    return (
      <div className="flex w-[20rem] flex-col gap-4">
        <TextInput
          {...args}
          ref={inputRef}
          mode="TextField"
          value={comment}
          onChange={setComment}
          isActive={isActive}
          onClick={() => setIsActive((prev) => !prev)}
        />
        <button onClick={() => inputRef.current?.focus()}>포커스</button>
      </div>
    );
  },
  args: {
    hasIcon: true,
    placeholder: 'ref 테스트',
    isActive: false,
  },
};
