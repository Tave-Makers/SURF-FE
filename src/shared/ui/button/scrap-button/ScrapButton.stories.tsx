import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ScrapButton from './ScrapButton';

// ---------- Meta ----------
const meta: Meta<typeof ScrapButton> = {
  title: 'Shared/UI/Button/ScrapButton',
  component: ScrapButton,
  tags: ['autodocs'],
  argTypes: {
    isScrapped: {
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

// 기본 상태 (스크랩되지 않음)
export const Default: Story = {
  args: {
    isScrapped: false,
    count: 12,
  },
};

// 스크랩된 상태
export const Scrapped: Story = {
  args: {
    isScrapped: true,
    count: 13,
  },
};

// 인터랙티브 Playground (상태 변화 확인)
export const Playground: Story = {
  render: (args) => {
    const [scrapped, setScrapped] = useState(args.isScrapped);
    const [count, setCount] = useState(args.count ?? 0);

    /**
     * 스크랩 상태 클릭 시:
     * 1. 내부 scrapped/count 상태 갱신
     * 2. 외부(onScrapToggle) 콜백 실행 → Storybook Actions 탭에 로그 출력
     */
    const handleToggle = (newState: boolean) => {
      setScrapped(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onScrapToggle?.(newState);
    };

    return (
      <ScrapButton {...args} isScrapped={scrapped} count={count} onScrapToggle={handleToggle} />
    );
  },
  args: {
    isScrapped: false,
    count: 0,
  },
};
