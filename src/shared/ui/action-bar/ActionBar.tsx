import { forwardRef, useRef, useImperativeHandle } from 'react';
import { TextInput } from '../text-input/TextInput';
import { SurfIcon } from '../icon/SurfIcon';

type ActionBarProps = {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  onSend?: (val: string) => void;
  onIconClick?: () => void;
  isEmojiActive?: boolean;
};

export const ActionBar = forwardRef<HTMLInputElement, ActionBarProps>(
  ({ value, onChange, placeholder, onSend, onIconClick, isEmojiActive = false }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => internalRef.current!, []);

    const handleSend = () => {
      const inputValue = internalRef.current?.value.trim();
      if (!inputValue) return;
      onSend?.(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className="bg-background-background-normal-lighter flex w-full items-center gap-10 px-13 pt-13 pb-15">
        <TextInput
          ref={internalRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          iconName={isEmojiActive ? 'SmileCircleSolid' : 'SmileCircle'}
          onIconClick={onIconClick}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSend}
          className="bg-background-background-primary group hover:bg-background-background-primary-darker rounded-max flex h-[2rem] w-[2rem] shrink-0 items-center justify-center p-7"
        >
          <SurfIcon
            name="ArrowUp"
            size="l"
            className="text-foreground-foreground-accent group-hover:text-foreground-foreground-accent-hover transition-colors duration-200"
          />
        </button>
      </div>
    );
  },
);

ActionBar.displayName = 'ActionBar';
