'use client';

import type { ReactNode } from 'react';

/**
 * Sheet 내부에서 사용되는 단일 항목 컴포넌트
 *
 * @param props - SheetItem 컴포넌트 props
 * @param props.title - 항목에 표시되는 텍스트 라벨
 * @param props.node - 좌측에 표시되는 아이콘 또는 커스텀 노드
 * @param props.onClick - 항목 클릭 시 호출되는 콜백 함수
 * @param props.pressed - 항목 선택 또는 활성화 상태
 * @param props.textColor - 텍스트 색상 타입
 */

type TextColor = 'normal' | 'danger';

interface SheetItemProps {
  title: string;
  node?: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
  textColor?: TextColor;
}

const TEXT_COLOR_STYLES: Record<TextColor, string> = {
  normal: 'text-foreground-normal',
  danger: 'text-foreground-danger-darker',
};

export const SheetItem = ({
  title,
  node,
  onClick,
  pressed,
  textColor = 'normal',
}: SheetItemProps) => {
  const textColorClass = TEXT_COLOR_STYLES[textColor];
  const interactiveClass = onClick ? 'cursor-pointer' : 'cursor-default';
  const stateClass = pressed
    ? 'bg-background-secondary'
    : onClick
      ? 'hover:bg-background-secondary'
      : '';
  const className = `rounded-3 flex w-full items-center gap-8 px-12 py-10 transition-colors ${interactiveClass} ${stateClass}`;
  const content = (
    <>
      {node && <div className="flex h-[1.5rem] w-[1.5rem] items-center justify-center">{node}</div>}
      <span className={`text-body-body6 ${textColorClass}`}>{title}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={pressed} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
};
