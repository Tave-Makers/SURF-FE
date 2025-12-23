import type { Meta, StoryObj } from '@storybook/nextjs';
import { Control } from './Control';

const meta: Meta<typeof Control> = {
  title: 'Shared/UI/Carousel/Control',
  component: Control,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Control 버튼의 방향 (아이콘/aria-label 결정)',
    },
    className: {
      control: 'text',
      description: 'absolute 위치 및 추가 스타일',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Control>;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-5 relative h-[150px] w-[320px] bg-neutral-200">{children}</div>;
};

export const Left: Story = {
  name: 'Left Control',
  args: {
    direction: 'left',
    className: 'absolute left-[10px] top-1/2 -translate-y-1/2',
  },
  render: (args) => (
    <Wrapper>
      <Control {...args} />
    </Wrapper>
  ),
};

export const Right: Story = {
  name: 'Right Control',
  args: {
    direction: 'right',
    className: 'absolute right-[10px] top-1/2 -translate-y-1/2',
  },
  render: (args) => (
    <Wrapper>
      <Control {...args} />
    </Wrapper>
  ),
};

export const Both: Story = {
  name: 'Both Controls (Carousel Example)',
  render: () => (
    <Wrapper>
      <Control
        direction="left"
        onClick={() => {}}
        className="absolute top-1/2 left-[10px] -translate-y-1/2"
      />
      <Control
        direction="right"
        onClick={() => {}}
        className="absolute top-1/2 right-[10px] -translate-y-1/2"
      />
    </Wrapper>
  ),
};
