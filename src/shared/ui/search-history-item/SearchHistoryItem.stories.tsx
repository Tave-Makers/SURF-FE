import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SearchHistoryItem from './SearchHistoryItem';

const meta: Meta<typeof SearchHistoryItem> = {
  title: 'Shared/UI/SearchHistoryItem',
  component: SearchHistoryItem,
  tags: ['autodocs'],
  argTypes: {
    keyword: {
      control: 'text',
      description: '검색 기록 키워드',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchHistoryItem>;

// 🔍 기본 예시
export const Default: Story = {
  args: {
    keyword: '카페 추천',
  },
};

// 🧪 Playground (키워드 직접 입력)
export const Playground: Story = {
  args: {
    keyword: '테스트 검색어',
  },
};
