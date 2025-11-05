'use client';
import { useCallback, useState } from 'react';

/**
 * 시트/모달/드롭다운/팝오버 등 “무언가를 열고 값 하나를 선택”하는 흐름을
 * UI에 종속되지 않게 제어하는 훅.
 *
 * @template T 선택 값의 타입(기본값: `string`)
 *
 * @param {Object} [options] 훅 옵션
 * @param {boolean} [options.defaultOpen=false] 최초 열림 상태
 * @param {T|null}  [options.defaultValue=null] 최초 선택 값
 * @param {boolean} [options.closeOnSelect=true] 값을 선택하면 자동으로 닫을지 여부
 * @param {(value: T|null) => void} [options.onChange] 선택 값이 변경될 때 호출되는 콜백
 *
 * @example
 * // 기본 사용
 * const picker = usePicker<string>();
 * <button onClick={picker.open}>열기</button>
 * {picker.isOpen && (
 *   <div role="dialog">
 *     <button onClick={() => picker.select('Seoul')}>Seoul</button>
 *     <button onClick={picker.close}>닫기</button>
 *   </div>
 * )}
 *
 * @example
 * // 부모 상태와 동기화
 * const [city, setCity] = useState<string | null>(null);
 * const picker = usePicker<string>({
 *   defaultValue: city,
 *   onChange: setCity,
 * });
 *
 */

type PickerOptions<T> = {
  defaultOpen?: boolean;
  defaultValue?: T | null;
  closeOnSelect?: boolean;
  onChange?: (value: T | null) => void;
};

export function usePicker<T = string>({
  defaultOpen = false,
  defaultValue = null,
  closeOnSelect = true,
  onChange,
}: PickerOptions<T> = {}) {
  const [isOpen, setOpen] = useState(defaultOpen);
  const [value, setValueState] = useState<T | null>(defaultValue);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  /** 단일 진입점: 값 변경 + onChange 보장 + 닫힘 옵션 처리(override 가능) */
  const setValue = useCallback(
    (next: T | null, opts?: { close?: boolean }) => {
      setValueState(next);
      onChange?.(next);

      // close 여부 결정
      // 옵션 없으면 "값이 null이 아닐 때 closeOnSelect 규칙"에 따라 결정
      const shouldClose = opts?.close ?? (next !== null && closeOnSelect);
      if (shouldClose) setOpen(false);
    },
    [onChange, closeOnSelect],
  );

  const select = useCallback(
    (next: T) => setValue(next), // 선택 시: onChange 호출 + 기본 규칙으로 닫힘
    [setValue],
  );

  const clear = useCallback(
    () => setValue(null, { close: false }), // 초기화는 보통 닫지 않음
    [setValue],
  );

  return {
    // state
    isOpen,
    value,
    // open/close controls
    open,
    close,
    toggle,
    setOpen, // 필요 시 직접 제어
    // value controls
    select,
    clear,
    setValue, // 외부에서도 사용 가능
  };
}
