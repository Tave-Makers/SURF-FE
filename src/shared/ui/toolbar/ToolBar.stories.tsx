'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToolBar } from './ToolBar';
import type { ToolBarItem } from './ToolBar';

const SAMPLE_ITEMS: ToolBarItem[] = [
  { key: 'camera', label: '홈', icon: 'CameraSolid' },
  { key: 'alarm', label: '예약', icon: 'AlarmSolid' },
  { key: 'calendar', label: '일정', icon: 'CalendarSolid' },
  { key: 'bold', label: '굵게', icon: 'LetterBSolid' },
];

const meta: Meta<typeof ToolBar> = {
  title: 'Shared/UI/ToolBar',
  component: ToolBar,
  parameters: {
    docs: {
      description: {
        component:
          '하단 내비게이션/툴바 컴포넌트. 여러 ToolBarItems를 가로로 배치하고, activeKey로 현재 활성화된 탭을 표시합니다.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: '추가 클래스',
    },
    activeKey: {
      control: 'text',
      description: '현재 활성화된 key',
    },
    onItemClick: {
      action: 'item-click',
      description: '탭 클릭 시 호출',
    },
  },
};
export default meta;

type Story = StoryObj<typeof ToolBar>;

/**
 * 기본 스토리 (interactive)
 * - useState로 activeKey를 관리
 * - 실제로 버튼 눌러보면 activeKey 바뀌고 스타일도 변해
 */
export const Default: Story = {
  render: (args) => {
    const [activeKey, setActiveKey] = useState('home');

    return (
      <div>
        <div className="text-body-body7 text-foreground-foreground-normal">
          현재 활성 탭: {activeKey}
        </div>

        <ToolBar
          {...args}
          items={SAMPLE_ITEMS}
          activeKey={activeKey}
          onItemClick={(key) => {
            setActiveKey(key);
            args.onItemClick?.(key);
          }}
        />
      </div>
    );
  },
  args: {
    className: '',
  },
};
