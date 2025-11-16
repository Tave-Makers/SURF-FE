import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Shared/UI/TextInput',
  component: TextInput,
  argTypes: {
    placeholder: { control: 'text' },
    iconName: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

/* 검색창 */
export const SearchField: Story = {
  render: (args) => {
    const [search, setSearch] = useState('');
    return (
      <div className="w-[19.56rem]">
        <TextInput
          {...args}
          value={search}
          onChange={setSearch}
          iconName="Search"
          onIconClick={() => alert(`검색 버튼 클릭: ${search}`)}
          onEnter={(val) => alert(`검색 엔터 입력: ${val}`)}
        />
      </div>
    );
  },
  args: {
    placeholder: '검색어를 입력하세요',
  },
};

/* 댓글 입력창 */
export const TextField: Story = {
  render: (args) => {
    const [comment, setComment] = useState('');
    const [isEmojiActive, setIsEmojiActive] = useState(false);
    return (
      <div className="w-[19.56rem]">
        <TextInput
          {...args}
          value={comment}
          onChange={setComment}
          iconName={isEmojiActive ? 'SmileCircleSolid' : 'SmileCircle'}
          onIconClick={() => setIsEmojiActive((prev) => !prev)}
          onEnter={(val) => alert(`댓글 엔터 입력: ${val}`)}
        />
      </div>
    );
  },
  args: {
    placeholder: '댓글을 입력하세요',
  },
};

/* Ref 사용 예시 (부모에서 포커스 제어) */
export const WithRef: Story = {
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [comment, setComment] = useState('');
    const [isEmojiActive, setIsEmojiActive] = useState(false);

    return (
      <div className="flex w-[20rem] flex-col gap-4">
        <TextInput
          {...args}
          ref={inputRef}
          value={comment}
          onChange={setComment}
          iconName={isEmojiActive ? 'SmileCircleSolid' : 'SmileCircle'}
          onIconClick={() => setIsEmojiActive((prev) => !prev)}
          onEnter={(val) => alert(`withRef 엔터 입력: ${val}`)}
        />
        <button onClick={() => inputRef.current?.focus()}>포커스</button>
      </div>
    );
  },
  args: {
    placeholder: 'ref 테스트',
  },
};
