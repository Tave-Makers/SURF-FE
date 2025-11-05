'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToolBar } from './ToolBar';
import type { ToolBarItem } from './ToolBar';

const SAMPLE_ITEMS: ToolBarItem[] = [
  { key: 'camera', label: '사진', icon: 'CameraSolid' },
  { key: 'alarm', label: '예약', icon: 'AlarmSolid' },
  { key: 'calendar', label: '일정', icon: 'CalendarSolid' },
  { key: 'bold', label: '굵게', icon: 'LetterBSolid' },
];

const meta: Meta<typeof ToolBar> = {
  title: 'Shared/UI/ToolBar',
  component: ToolBar,
  tags: ['autodocs'],
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

export const Default: Story = {
  render: (args) => {
    const [activeKey, setActiveKey] = useState('camera');

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
