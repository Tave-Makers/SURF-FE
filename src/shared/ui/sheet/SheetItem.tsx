'use client';

import type { ReactNode } from 'react';

/**
 * Sheet 내부에서 사용되는 단일 항목 컴포넌트
 *
 * @param props - SheetItem 컴포넌트 props
 * @param props.title - 항목에 표시되는 텍스트 라벨
 * @param props.node - 좌측에 표시되는 아이콘 또는 커스텀 노드
 * @param props.onClick - 항목 클릭 시 호출되는 콜백 함수
 * @param props.textColor - 텍스트 색상 타입
 */

type textColor = 'normal' | 'danger';

interface SheetItemProps {
  title: string;
  node?: ReactNode;
  onClick?: () => void;
  textColor?: textColor;
}

export default function SheetItem({ title, node, onClick, textColor = 'normal' }: SheetItemProps) {
  const textColorClass =
    textColor === 'danger' ? 'text-foreground-danger-darker' : 'text-foreground-normal';

  return (
    <button onClick={onClick} className="flex w-full items-center gap-8 px-12 py-10">
      {node && <div className="flex h-[1.5rem] w-[1.5rem] items-center justify-center">{node}</div>}

      <span className={`text-body-body6 ${textColorClass}`}>{title}</span>
    </button>
  );
}
