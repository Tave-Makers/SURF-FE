import type { Meta, StoryObj } from '@storybook/nextjs';
import { MenuDropDown } from './MenuDropDown';

type StoryItem = {
  id: number;
  label: string;
  type: 'default' | 'active' | 'selected';
};

const meta: Meta<typeof MenuDropDown<StoryItem>> = {
  title: 'Shared/UI/Menu/MenuDropDown',
  component: MenuDropDown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MenuDropDown<StoryItem>>;

// 더미 데이터
const MOCK_ITEMS1: StoryItem[] = [
  { id: 1, label: 'default', type: 'default' },
  { id: 2, label: 'active clicked', type: 'active' },
  { id: 3, label: 'selected', type: 'selected' },
  { id: 4, label: 'default', type: 'default' },
  { id: 5, label: 'default', type: 'default' },
];

const MOCK_ITEMS2: StoryItem[] = [
  { id: 1, label: 'default', type: 'default' },
  { id: 2, label: 'active clicked', type: 'active' },
  { id: 3, label: 'selected', type: 'selected' },
  { id: 4, label: 'default', type: 'default' },
  { id: 5, label: 'default', type: 'default' },
  { id: 6, label: 'default', type: 'default' },
  { id: 7, label: 'default', type: 'default' },
];

const renderStoryItem = (item: StoryItem, onItemClick: () => void) => {
  let className =
    'w-full h-[1.87rem] items-center justify-center px-10 text-sm rounded-3 text-body-body11 ';

  if (item.type === 'active') {
    className += 'bg-background-quaternary text-foreground-secondary';
  } else if (item.type === 'selected') {
    className += 'text-foreground-primary';
  } else {
    className += 'text-foreground-secondary';
  }

  return (
    <button type="button" className={className} onClick={onItemClick}>
      {item.label}
    </button>
  );
};

export const Default: Story = {
  args: {
    items: MOCK_ITEMS1,
    onItemClick: (item) => alert(`Clicked ${item.label}`),
    renderItem: renderStoryItem,
  },
};

export const Scroll: Story = {
  args: {
    items: MOCK_ITEMS2,
    onItemClick: (item) => alert(`Clicked ${item.label}`),
    renderItem: renderStoryItem,
  },
};
