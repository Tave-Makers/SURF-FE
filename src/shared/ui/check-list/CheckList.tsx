'use client';
import React from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type CheckListProps = {
  id: number; // 체크리스트 아이템 id
  title: string; // 체크리스트 아이템 제목
  isChecked: boolean; // 체크 여부
  onChange: (checked: boolean, id: number) => void; // 체크 여부 변경 시 부모에 전달
  onClickItem?: (id: number) => void; // 클릭 시 어떤 아이템인지 부모에 전달
};

export function CheckList({
  id,
  title = 'Title',
  isChecked = false,
  onChange,
  onClickItem,
}: CheckListProps) {
  return (
    <div className="flex w-full items-center gap-[0.35rem] pr-[0.62rem]">
      {/* 체크 토글 버튼 및 제목 */}
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-[0.35rem]"
        type="button"
        aria-pressed={!!isChecked}
        aria-label={`${title} 체크 전환`}
        onClick={() => onChange(!isChecked, id)}
        data-checked={!!isChecked}
      >
        <SurfIcon
          name="Check"
          size="m"
          className={isChecked ? 'text-background-primary' : 'text-foreground-hint'}
        />
        <div className="text-foreground-secondary-darker text-body-14-600--1-24 flex shrink-0 grow basis-0">
          {title}
        </div>
      </button>
      {/* 우측 버튼*/}
      <button onClick={() => onClickItem?.(id)} className="cursor-pointer">
        <SurfIcon name="ChevronRight" size="m" className="text-foreground-hint" />
      </button>
    </div>
  );
}
