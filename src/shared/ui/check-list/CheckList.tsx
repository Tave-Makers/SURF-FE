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
      {/* 체크 토글 버튼 */}
      <button onClick={() => onChange(!isChecked, id)} className="cursor-pointer">
        <SurfIcon
          name="Check"
          size="m"
          className={
            isChecked
              ? 'text-[color:var(--color-background-primary)]'
              : 'text-[color:var(--color-foreground-hint)]'
          }
        />
      </button>
      {/* 제목 및 오른쪽 아이콘 버튼*/}
      <button className="flex w-full cursor-pointer" onClick={() => onClickItem?.(id)}>
        <div className="text-[color: var(--color-foreground-secondary-darker)] text-body-14-600--1-24 flex shrink-0 grow basis-0">
          {title}
        </div>
        <div>
          <SurfIcon
            name="ChevronRight"
            size="s"
            className="text-[color:var(--color-foreground-hint)]"
          />
        </div>
      </button>
    </div>
  );
}
