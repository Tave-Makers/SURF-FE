import type { Meta, StoryObj } from '@storybook/nextjs';
import { Menu } from './Menu';
import { useState } from 'react';

const meta = {
  title: 'Shared/UI/Menu/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

// 1. 기본 스토리 (단순 UI 확인용)
export const Default: Story = {
  args: {
    label: '기수',
    isOpen: false,
    onToggle: () => {},
    onClose: () => {},
    itemList: [
      { id: 1, label: '1기', onClick: () => {} },
      { id: 2, label: '2기', onClick: () => {}, isSelected: true },
    ],
  },
};

// 2. 상호작용 스토리 (실제 열림/닫힘 및 선택 동작 확인)
export const Interactive: Story = {
  render: (args) => {
    // 메뉴 열림 상태 관리
    const [isOpen, setIsOpen] = useState(false);
    // 선택된 아이템 관리
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const interactiveItemList = args.itemList?.map((item) => ({
      ...item,
      isSelected: item.id === selectedId,
      onClick: () => {
        setSelectedId(item.id);
        item.onClick?.();
        setIsOpen(false); // 선택 시 닫기
      },
    }));

    return (
      <Menu
        {...args}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onClose={() => setIsOpen(false)}
        itemList={interactiveItemList}
        label={interactiveItemList?.find((i) => i.id === selectedId)?.label || args.label}
      />
    );
  },
  args: {
    label: '선택하세요',
    isOpen: false,
    onToggle: () => {},
    onClose: () => {},
    itemList: [
      { id: 1, label: 'Option 1', onClick: () => console.log('1 clicked') },
      { id: 2, label: 'Option 2', onClick: () => console.log('2 clicked') },
      { id: 3, label: 'Option 3', onClick: () => console.log('3 clicked') },
    ],
  },
};
