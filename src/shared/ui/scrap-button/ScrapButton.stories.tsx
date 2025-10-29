import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ScrapButton from './ScrapButton';

// ---------- Meta ----------
const meta: Meta<typeof ScrapButton> = {
  title: 'Shared/UI/ScrapButton',
  component: ScrapButton,
  tags: ['autodocs'],
  argTypes: {
    isScraped: {
      control: 'boolean',
      description: '스크랩 상태 여부',
    },
    count: {
      control: 'number',
      description: '스크랩 개수',
    },
    onScrapToggle: {
      action: 'toggled',
      description: '스크랩 클릭 콜백 (Actions 탭에서 확인 가능)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScrapButton>;

// ---------- Story Variants ----------

// 🩶 기본 상태 (스크랩되지 않음)
export const Default: Story = {
  args: {
    isScraped: false,
    count: 12,
  },
};

// 💙 스크랩된 상태
export const Scrapped: Story = {
  args: {
    isScraped: true,
    count: 13,
  },
};

// 🧪 인터랙티브 Playground (상태 변화 확인)
export const Playground: Story = {
  render: (args) => {
    const [scraped, setScraped] = useState(args.isScraped);
    const [count, setCount] = useState(args.count ?? 0);

    /**
     * 스크랩 상태 클릭 시:
     * 1. 내부 scraped/count 상태 갱신
     * 2. 외부(onToggle) 콜백 실행 → Storybook Actions 탭에 로그 출력
     */
    const handleToggle = (newState: boolean) => {
      setScraped(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onScrapToggle?.(newState);
    };

    return <ScrapButton {...args} isScraped={scraped} count={count} onScrapToggle={handleToggle} />;
  },
  args: {
    isScraped: false,
    count: 0,
  },
};
