'use client';

import type { ReactNode } from 'react';

type SheetItemProps = {
  title: string;
  node?: ReactNode;
  onClick?: () => void;
  textColor?: 'normal' | 'danger';
};

/**
 * Sheet 내부에서 사용되는 단일 항목 컴포넌트
 *
 * @param {Object} props - SheetItem 컴포넌트 props
 * @param {string} props.title - 항목의 텍스트 라벨 (예: "삭제하기", "수정하기")
 * @param {ReactNode} [props.node] - 좌측에 표시되는 아이콘 또는 커스텀 노드
 * @param {() => void} [props.onClick] - 항목 클릭 시 호출되는 콜백
 * @param {'normal' | 'danger'} [props.textColor='normal'] - 텍스트 색상 (기본: normal)
 */
export function SheetItem({ title, node, onClick, textColor = 'normal' }: SheetItemProps) {
  const textColorClass =
    textColor === 'danger' ? 'text-foreground-danger' : 'text-foreground-normal';

  return (
    <button onClick={onClick} className="flex w-full items-center gap-8 px-12 py-10">
      {/* Left Node */}
      {node && <div className="flex h-[1.5rem] w-[1.5rem] items-center justify-center">{node}</div>}

      {/* Title */}
      <span className={`text-body-body5 ${textColorClass}`}>{title}</span>
    </button>
  );
}
