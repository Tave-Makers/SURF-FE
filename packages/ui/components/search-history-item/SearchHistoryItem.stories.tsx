import type { Meta, StoryObj } from '@storybook/nextjs';
import { SearchHistoryItem } from './SearchHistoryItem';
import React from 'react';

// ---------- Meta ----------
const meta: Meta<typeof SearchHistoryItem> = {
  title: 'Shared/UI/SearchHistoryItem',
  component: SearchHistoryItem,
  tags: ['autodocs'],
  argTypes: {
    keyword: {
      control: 'text',
      description: '검색 기록 키워드',
    },
    onSelect: {
      action: 'selected',
      description: '검색 기록 클릭 콜백',
    },
    onDelete: {
      action: 'deleted',
      description: '검색 기록 삭제 콜백',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchHistoryItem>;

// ---------- Story Variants ----------

// 기본 예시
export const Default: Story = {
  args: {
    keyword: '카페 추천',
    onSelect: (keyword: string) => alert(`🔍 "${keyword}"로 검색`),
    onDelete: () => alert('🗑️ 검색 기록 삭제'),
  },
};

// Playground (검색어 직접 수정 가능)
export const Playground: Story = {
  render: (args) => {
    const handleSelect = (kw: string) => {
      alert(`🔍 "${kw}"로 검색`);
      args.onSelect?.(kw);
    };

    const handleDelete = () => {
      alert(`🗑️ "${args.keyword}" 검색 기록 삭제`);
      args.onDelete?.();
    };

    return <SearchHistoryItem {...args} onSelect={handleSelect} onDelete={handleDelete} />;
  },
  args: {
    keyword: '테스트 검색어',
  },
};
