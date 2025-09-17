import { forwardRef, useRef, useImperativeHandle } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type TextInputProps =
  | {
      mode: 'SearchField'; // 검색창
      value: string; // 현재 입력된 값
      onChange: (val: string) => void; // 입력값 변경 시 부모로 전달
      placeholder?: string; // placeholder
      hasIcon?: boolean; // 아이콘 표시
      onSubmit: (value: string) => void; // 아이콘 클릭 시, 부모에 입력된 검색어 전달
    }
  | {
      mode: 'TextField'; // 댓글 입력창
      value: string; // 현재 입력된 댓글
      onChange: (val: string) => void; // 댓글 입력 변경 시 부모로 전달
      placeholder?: string; // placeholder
      hasIcon?: boolean; // 아이콘 표시
      isActive?: boolean; // 아이콘 활성화
      onClick: () => void; // 아이콘 클릭 시, 부모에 이벤트 전달
    };

/* placeholder 기본값 */
const PLACEHOLDERS = {
  SearchField: '글, 제목, 내용을 입력해주세요.',
  TextField: '댓글을 입력해주세요.',
} as const;

/* mode별 props 기본값 */
const DEFAULTS = {
  SearchField: { hasIcon: true },
  TextField: { hasIcon: true, isActive: false },
} as const;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { mode, value, onChange } = props;
  const internalRef = useRef<HTMLInputElement>(null);

  /* 외부에서 ref를 넘겨주면 내부 input DOM을 직접 제어할 수 있게 노출 */
  useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

  const placeholder = props.placeholder ?? PLACEHOLDERS[mode];

  /* 입력된 값을 onSubmit 콜백에 전달 */
  const handleSearch = () => {
    if (!value.trim()) return;
    if (mode === 'SearchField') {
      props.onSubmit(value);
    }
  };

  return (
    <div className="flex h-[2.25rem] w-full shrink-0 items-center justify-between rounded-[62.43rem] bg-[var(--color-background-tertiary)] py-[0.37rem] pr-[0.5rem] pl-[0.75rem]">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={internalRef}
        className="placeholder-body-14-600--1-24 text-body-14-400--2-22 text-[color:var(--color-foreground-normal)] placeholder:[color:var(--color-background-quaternary)]"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (mode === 'SearchField') {
              handleSearch();
            }
          }
        }}
      />

      {/* SearchField: hasIcon이 true일 경우 아이콘 표시*/}
      {mode === 'SearchField' && (props.hasIcon ?? DEFAULTS.SearchField.hasIcon) && (
        <button type="button" onClick={handleSearch}>
          <SurfIcon
            name="Search"
            size="l"
            className="cursor-pointer text-[color:var(--color-border-normal)]"
          />
        </button>
      )}

      {/* TextField: isActive 여부에 따라 다른 아이콘 표시 */}
      {mode === 'TextField' && (props.hasIcon ?? DEFAULTS.TextField.hasIcon) && (
        <button type="button" onClick={props.onClick}>
          {(props.isActive ?? DEFAULTS.TextField.isActive) ? (
            <SurfIcon
              name="SmileCircleSolid"
              size="l"
              className="cursor-pointer text-[color:var(--color-border-normal)]"
            />
          ) : (
            <SurfIcon
              name="SmileCircle"
              size="l"
              className="cursor-pointer text-[color:var(--color-border-normal)]"
            />
          )}
        </button>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
