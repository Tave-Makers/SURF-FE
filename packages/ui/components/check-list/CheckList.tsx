'use client';
import React from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type CheckListProps = {
  id: string; // 체크리스트 아이템 id
  title: string; // 체크리스트 아이템 제목
  isChecked: boolean; // 체크 여부
  onChange: (checked: boolean, id: string) => void; // 체크 여부 변경 시 부모에 전달
  onClickItem?: (id: string) => void; // 클릭 시 어떤 아이템인지 부모에 전달
};

export const CheckList = ({
  id,
  title = 'Title',
  isChecked = false,
  onChange,
  onClickItem,
}: CheckListProps) => {
  return (
    <div className="flex w-full items-center gap-7 pr-10">
      {/* 체크 토글 버튼 및 제목 */}
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-7 py-2"
        type="button"
        aria-pressed={!!isChecked}
        aria-label={`${title} 체크 전환`}
        onClick={() => onChange(!isChecked, id)}
        data-checked={!!isChecked}
      >
        <SurfIcon
          name="Check"
          size="m"
          className={isChecked ? 'text-background-primary' : 'text-foreground-tertiary'}
        />
        <div className="text-foreground-normal-lighter text-body-body8 flex shrink-0 grow basis-0">
          {title}
        </div>
      </button>
      {/* 우측 버튼*/}
      <button onClick={() => onClickItem?.(id)} className="cursor-pointer py-2">
        <SurfIcon name="ChevronRight" size="m" className="text-foreground-tertiary" />
      </button>
    </div>
  );
};
