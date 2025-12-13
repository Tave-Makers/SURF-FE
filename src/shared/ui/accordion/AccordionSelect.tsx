'use client';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

/**
 * AccordionSelect 컴포넌트
 *
 * 아코디언 형태의 셀렉트 트리거 UI 컴포넌트입니다.
 * 클릭 시 시트 또는 하위 콘텐츠를 열고 닫는 동작을 수행하며,
 * 선택형 시트(`useSelectSheet`) 등과 함께 조합하여 사용합니다.
 *
 * @props
 * - `title`: 버튼에 표시할 텍스트
 * - `isOpen`: 현재 열림 상태 (true일 경우 아이콘이 회전)
 * - `onClick`: 클릭 시 실행할 콜백 함수
 * - `controlsId`: (선택) aria-controls로 연결할 콘텐츠의 ID
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useToggleSheet();
 *
 * <AccordionSelect
 *   title="행사 종류 선택"
 *   isOpen={isOpen}
 *   onClick={open}
 *   controlsId="select-sheet"
 * />
 * ```
 */

type AccordionSelectProps = {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  controlsId?: string;
};

export function AccordionSelect({ title, isOpen, onClick, controlsId }: AccordionSelectProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-normal bg-background-background-normal flex w-full items-center justify-between border-b py-10"
      aria-expanded={isOpen}
      {...(controlsId && { 'aria-controls': controlsId })}
    >
      <span className="text-body-body7 text-foreground-foreground-normal">{title}</span>
      <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <SurfIcon name="ChevronDown" size="l" />
      </span>
    </button>
  );
}
