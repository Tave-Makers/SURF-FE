import { forwardRef, useRef, useImperativeHandle } from 'react';
import { TextInput } from '../text-input/TextInput';
import { SurfIcon } from '../icon/SurfIcon';

/**
 * 범용 메시지 입력 및 전송 컴포넌트
 *
 * 내부적으로 `TextInput`을 사용하며, Enter 입력 또는 전송 버튼 클릭 시 `onSend` 콜백이 호출됩니다.
 * Controlled / Uncontrolled 양쪽 모드 모두 지원합니다.
 *
 * ---
 * ### Props
 * @typedef {object} ActionBarProps
 * @param {string} [value] - 입력값 (Controlled 모드)
 * @param {string} [defaultValue] - 초기값 (Uncontrolled 모드)
 * @param {(val: string) => void} [onChange] - 입력 변경 핸들러 (Controlled 모드)
 * @param {string} [placeholder] - placeholder 텍스트
 * @param {(val: string) => void} [onSend] - 메시지 전송 핸들러 (Enter 또는 버튼 클릭 시 호출)
 * @param {() => void} [onIconClick] - 아이콘 클릭 시 호출되는 콜백
 * @param {boolean} [isEmojiActive=false] - 이모지 버튼 활성화 여부 (true일 경우 Solid 아이콘 표시)
 * ---
 * ### 기타
 * - 전송 후 입력값은 자동으로 초기화됩니다.
 * - ref를 사용해 부모 컴포넌트에서 직접 포커스 제어가 가능합니다.
 */

interface ActionBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  onSend?: (val: string) => void;
  onIconClick?: () => void;
  isEmojiActive?: boolean;
}

export const ActionBar = forwardRef<HTMLTextAreaElement, ActionBarProps>(
  (
    { value, defaultValue, onChange, placeholder, onSend, onIconClick, isEmojiActive = false },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    /** 메시지 전송 및 입력 초기화 */
    const handleSend = () => {
      const rawValue = internalRef.current?.value ?? '';
      const trimmedValue = rawValue.trim();
      if (!trimmedValue) return;

      onSend?.(trimmedValue);

      // 전송 후 입력 초기화
      if (value !== undefined) {
        onChange?.('');
      } else if (internalRef.current) {
        internalRef.current.value = '';
        internalRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }

      internalRef.current?.focus(); // 포커스 유지
    };

    return (
      <div className="border-border-normal bg-background-normal flex w-full items-center gap-10 border-t px-13 pt-13 pb-15">
        <TextInput
          mode="chat"
          ref={internalRef}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          iconName={isEmojiActive ? 'SmileCircleSolid' : 'SmileCircle'}
          onIconClick={onIconClick}
          onEnter={handleSend}
        />
        <button
          type="button"
          onClick={handleSend}
          className="bg-background-primary group hover:bg-background-primary-darker rounded-max flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center self-end p-7"
        >
          <SurfIcon
            name="ArrowUp"
            size="l"
            className="text-foreground-static-white group-hover:text-foreground-tertiary transition-colors duration-200"
          />
        </button>
      </div>
    );
  },
);

ActionBar.displayName = 'ActionBar';
