import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ChipToggle } from './ChipToggle';

// ---------- Meta ----------
const meta: Meta<typeof ChipToggle> = {
  title: 'Shared/UI/ChipToggle',
  component: ChipToggle,
  tags: ['autodocs'],
  argTypes: {
    iconName: {
      control: 'text',
      description: '아이콘 이름 (SurfIcon 기준)',
      defaultValue: 'Heart',
    },
    isClicked: {
      control: 'boolean',
      description: '현재 클릭 상태',
    },
    count: {
      control: 'number',
      description: '표시할 숫자',
    },
    activeColor: {
      control: 'text',
      description: '활성화 상태일 때 적용할 색상 클래스',
      defaultValue: 'red',
    },
    onToggleIcon: {
      action: 'icon-toggled',
      description: '아이콘 클릭 시 호출되는 콜백',
    },
    onClickNumber: {
      description: '숫자 클릭 시 호출되는 콜백',
      control: false,
    },
  },
};
export default meta;

type Story = StoryObj<typeof ChipToggle>;

// ---------- Story Variants ----------

// 1. 기본 (비활성 상태)
export const Default: Story = {
  args: {
    iconName: 'Heart',
    isClicked: false,
    count: 23,
    activeColor: 'red',
    mode: 'like',
    onToggleIcon: () => {},
  },
};

// 2. 클릭된 상태
export const Clicked: Story = {
  args: {
    iconName: 'Heart',
    isClicked: true,
    count: 23,
    activeColor: 'red',
    mode: 'like',
    onToggleIcon: () => {},
  },
};

// 3. Playground - onClickNumber 전달되지 않은 경우 (fallback → onToggleIcon 실행)
export const WithoutNumberClick: Story = {
  render: (args) => {
    const [clicked, setClicked] = useState(args.isClicked);
    const [count, setCount] = useState(args.count ?? 0);

    const handleToggle = (newState: boolean) => {
      setClicked(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onToggleIcon?.(newState);
    };

    return (
      <ChipToggle
        {...args}
        isClicked={clicked}
        count={count}
        onToggleIcon={handleToggle}
        // onClickNumber 전달하지 않음
      />
    );
  },
  args: {
    iconName: 'Heart',
    isClicked: false,
    count: 42,
    activeColor: 'red',
    mode: 'like',
  },
};

// 4. Playground - onClickNumber 전달된 경우 (아이콘/숫자 각각 별도 동작)
export const WithNumberClick: Story = {
  render: (args) => {
    const [clicked, setClicked] = useState(args.isClicked);
    const [count, setCount] = useState(args.count ?? 0);

    const handleToggle = (newState: boolean) => {
      setClicked(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onToggleIcon?.(newState);
    };

    const handleNumberClick = () => {
      alert('숫자 클릭됨');
      args.onClickNumber?.();
    };

    return (
      <ChipToggle
        {...args}
        isClicked={clicked}
        count={count}
        onToggleIcon={handleToggle}
        onClickNumber={handleNumberClick}
      />
    );
  },
  args: {
    iconName: 'Heart',
    isClicked: false,
    count: 42,
    activeColor: 'red',
    mode: 'like',
  },
};

// 5️. Playground - 아이콘 및 색상 커스터마이징
export const ScrapButton: Story = {
  render: (args) => {
    const [clicked, setClicked] = useState(args.isClicked);
    const [count, setCount] = useState(args.count ?? 0);

    const handleToggle = (newState: boolean) => {
      setClicked(newState);
      setCount((prev) => prev + (newState ? 1 : -1));
      args.onToggleIcon?.(newState);
    };

    return (
      <ChipToggle
        {...args}
        isClicked={clicked}
        count={count}
        onToggleIcon={handleToggle}
        activeColor="blue"
      />
    );
  },
  args: {
    iconName: 'Bookmark',
    isClicked: false,
    count: 42,
    mode: 'scrap',
  },
};
