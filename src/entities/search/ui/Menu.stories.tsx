import type { Meta, StoryObj } from '@storybook/nextjs';
import { Menu } from './Menu';
import { useState } from 'react';

const meta = {
  title: 'Entities/UI/Search/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Options',
    itemList: [
      { id: 1, label: 'Option 1', onClick: () => alert('Option 1 selected') },
      { id: 2, label: 'Option 2', onClick: () => alert('Option 2 selected'), isSelected: true },
      { id: 3, label: 'Option 3', onClick: () => alert('Option 3 selected') },
      { id: 4, label: 'Option 4', onClick: () => alert('Option 4 selected') },
      { id: 5, label: 'Option 5', onClick: () => alert('Option 5 selected') },
      { id: 6, label: 'Option 6', onClick: () => alert('Option 6 selected') },
    ],
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const interactiveItemList = args.itemList?.map((item) => ({
      ...item,
      isSelected: item.id === selectedId,
      onClick: () => {
        setSelectedId(item.id);
        item.onClick?.();
      },
    }));

    return <Menu {...args} itemList={interactiveItemList} />;
  },
  args: {
    label: 'Options',
    itemList: [
      { id: 1, label: 'Option 1', onClick: () => console.log('1 clicked') },
      { id: 2, label: 'Option 2', onClick: () => console.log('2 clicked') },
      { id: 3, label: 'Option 3', onClick: () => console.log('3 clicked') },
      { id: 4, label: 'Option 4', onClick: () => console.log('4 clicked') },
      { id: 5, label: 'Option 5', onClick: () => console.log('5 clicked') },
      { id: 6, label: 'Option 6', onClick: () => console.log('6 clicked') },
      { id: 7, label: 'Option 7', onClick: () => console.log('7 clicked') },
    ],
  },
};
