import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRef, useState } from 'react';
import { ActionBar } from './ActionBar';

const meta: Meta<typeof ActionBar> = {
  title: 'Shared/UI/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

/* ----------------------------------------------- */
/* Controlled                                      */
/* ----------------------------------------------- */
export const Controlled: Story = {
  render: () => {
    const [message, setMessage] = useState('');
    const [emojiActive, setEmojiActive] = useState(false);

    const handleSend = (val: string) => {
      alert(`(Controlled) 전송된 메시지: ${val}`);
      setMessage('');
    };

    const handleEmojiClick = () => {
      setEmojiActive((prev) => !prev);
    };

    return (
      <div className="w-[23.4rem] space-y-2">
        <ActionBar
          value={message}
          onChange={setMessage}
          placeholder="메시지를 입력하세요"
          onSend={handleSend}
          isEmojiActive={emojiActive}
          onIconClick={handleEmojiClick}
        />
        {emojiActive && (
          <div className="text-foreground-foreground-normal text-caption-caption4">
            😀 이모지 패널 열림 상태
          </div>
        )}
      </div>
    );
  },
};

/* ----------------------------------------------- */
/* Uncontrolled (내부 상태 기반)                     */
/* ----------------------------------------------- */
export const Uncontrolled: Story = {
  render: () => {
    const [emojiActive, setEmojiActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = (val: string) => {
      alert(`(Uncontrolled) 전송된 메시지: ${val}`);
      inputRef.current!.value = '';
    };

    const handleEmojiClick = () => {
      setEmojiActive((prev) => !prev);
    };

    return (
      <div className="w-[23.4rem] space-y-2">
        <ActionBar
          placeholder="댓글을 입력하세요"
          onSend={handleSend}
          isEmojiActive={emojiActive}
          onIconClick={handleEmojiClick}
          ref={inputRef}
        />
        {emojiActive && (
          <div className="text-foreground-foreground-normal text-caption-caption4">
            🪄 이모지 패널이 열려 있습니다
          </div>
        )}
      </div>
    );
  },
};
