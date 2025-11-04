import { forwardRef, useRef, useImperativeHandle } from 'react';
import { TextInput } from '../text-input/TextInput';
import { SurfIcon } from '../icon/SurfIcon';

/** textarea 높이 리셋 */
const resetTextInputHeight = (el?: HTMLTextAreaElement | null) => {
  if (!el) return;
  const wrapper = el.parentElement;
  requestAnimationFrame(() => {
    el.style.height = '';
    if (wrapper) wrapper.style.height = '';
  });
};

/**
 * 범용 메시지 입력 및 전송 컴포넌트
 *
 * 내부적으로 `TextInput`을 사용하며, Enter 입력 또는 전송 버튼 클릭 시 `onSend` 콜백이 호출됩니다.
 * Controlled / Uncontrolled 양쪽 모드 모두 지원합니다.
 *
 * ---
 * ### 🧩 사용 예시
 *
 * **Controlled**
 * ```tsx
 * const [message, setMessage] = useState('');
 * <ActionBar
 *   value={message}
 *   onChange={setMessage}
 *   onSend={(msg) => console.log('전송됨:', msg)}
 *   placeholder="메시지를 입력하세요"
 * />
 * ```
 *
 * **Uncontrolled**
 * ```tsx
 * <ActionBar
 *   defaultValue="안녕하세요"
 *   onSend={(msg) => console.log('전송됨:', msg)}
 *   placeholder="메시지를 입력하세요"
 * />
 * ```
 *
 * ---
 * ### ⚙️ Props
 * @typedef {object} ActionBarProps
 * @property {string} [value] - 입력값 (Controlled 모드)
 * @property {(val: string) => void} [onChange] - 입력 변경 핸들러 (Controlled 모드)
 * @property {string} [placeholder] - placeholder 텍스트
 * @property {(val: string) => void} [onSend] - 메시지 전송 핸들러 (Enter 또는 버튼 클릭 시 호출)
 * @property {() => void} [onIconClick] - 아이콘 클릭 시 호출되는 콜백
 * @property {boolean} [isEmojiActive=false] - 이모지 버튼 활성화 여부 (true일 경우 Solid 아이콘 표시)
 *
 * ---
 * ### 🧠 기타
 * - 전송 후 입력값은 자동으로 초기화됩니다.
 * - ref를 사용해 부모 컴포넌트에서 직접 포커스 제어가 가능합니다.
 */

type ActionBarProps = {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  onSend?: (val: string) => void;
  onIconClick?: () => void;
  isEmojiActive?: boolean;
};

export const ActionBar = forwardRef<HTMLTextAreaElement, ActionBarProps>(
  ({ value, onChange, placeholder, onSend, onIconClick, isEmojiActive = false }, ref) => {
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
        resetTextInputHeight(internalRef.current);
      } else if (internalRef.current) {
        internalRef.current.value = '';
        internalRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        resetTextInputHeight(internalRef.current);
      }

      internalRef.current?.focus(); // 포커스 유지
    };

    return (
      <div className="bg-background-background-normal-lighter flex w-full items-center gap-10 px-13 pt-13 pb-15">
        <TextInput
          mode="chat"
          ref={internalRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          iconName={isEmojiActive ? 'SmileCircleSolid' : 'SmileCircle'}
          onIconClick={onIconClick}
          onEnter={handleSend}
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
