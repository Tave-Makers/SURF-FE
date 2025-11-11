import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TextInput } from './TextInput';

/**
 * 💬 TextInput Storybook
 *
 * 범용 입력 필드 컴포넌트입니다.
 * Controlled / Uncontrolled, ref 제어, 아이콘, Enter 이벤트 등
 * 다양한 사용 시나리오를 테스트할 수 있습니다.
 */
const meta: Meta<typeof TextInput> = {
  title: 'Shared/UI/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '입력 필드의 placeholder 텍스트',
      defaultValue: '텍스트를 입력하세요',
    },
    iconName: {
      control: 'text',
      description: '우측 아이콘 이름 (SurfIcon name)',
    },
    onIconClick: {
      action: '아이콘 클릭됨',
      description: '아이콘 클릭 시 호출되는 이벤트',
    },
    onEnter: {
      action: '엔터 입력됨',
      description: 'Enter 입력 시 호출되는 이벤트',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Controlled / Uncontrolled 모드를 모두 지원하는 텍스트 입력 필드입니다.\
          `value`와 `onChange`를 전달하면 Controlled, 전달하지 않으면 내부 상태로 Uncontrolled 모드로 동작합니다.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

/* 🔍 검색창 */
export const SearchField: Story = {
  render: (args) => {
    const [search, setSearch] = useState('');
    return (
      <div className="w-[19.56rem]">
        <TextInput
          {...args}
          mode="search"
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
  parameters: {
    docs: {
      description: {
        story: '검색 입력 필드 시나리오. Enter 입력 또는 우측 아이콘 클릭 시 검색이 실행됩니다.',
      },
    },
  },
};

/* 💬 댓글 입력창 */
export const TextField: Story = {
  render: (args) => {
    const [comment, setComment] = useState('');
    const [isEmojiActive, setIsEmojiActive] = useState(false);
    return (
      <div className="w-[19.56rem]">
        <TextInput
          {...args}
          mode="chat"
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
  parameters: {
    docs: {
      description: {
        story: '댓글 입력 필드 시나리오. 이모지 버튼 클릭 시 아이콘이 토글됩니다.',
      },
    },
  },
};

/* ⚙️ Ref 제어 예시 */
export const WithRef: Story = {
  render: (args) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const [comment, setComment] = useState('');
    const [isEmojiActive, setIsEmojiActive] = useState(false);

    return (
      <div className="flex w-[20rem] flex-col gap-4">
        <TextInput
          {...args}
          mode="chat"
          ref={internalRef}
          value={comment}
          onChange={setComment}
          iconName={isEmojiActive ? 'SmileCircleSolid' : 'SmileCircle'}
          onIconClick={() => setIsEmojiActive((prev) => !prev)}
          onEnter={(val) => alert(`withRef 엔터 입력: ${val}`)}
        />
        <button
          onClick={() => internalRef.current?.focus()}
          className="bg-background-background-primary hover:bg-background-background-primary-darker rounded px-3 py-1 text-white transition-colors"
        >
          포커스 주기
        </button>
      </div>
    );
  },
  args: {
    placeholder: 'ref 테스트',
  },
  parameters: {
    docs: {
      description: {
        story: '`ref`를 전달하여 부모 컴포넌트에서 포커스를 직접 제어하는 예시입니다.',
      },
    },
  },
};
