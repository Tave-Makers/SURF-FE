import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EventCard } from '../EventCard';
import { EventDateCard } from '../EventDateCard';
import type { ActivityType, EventCardType } from '../../model/types';

type EventItem = {
  id: string;
  title: string;
  type: ActivityType;
  mode?: EventCardType;
  startDate?: Date | null;
  endDate?: Date | null;
  place: string;
};

const EventDateCardStory = (props: React.ComponentProps<typeof EventDateCard<EventItem>>) => (
  <EventDateCard<EventItem> {...props} />
);

const meta = {
  title: 'Entities/UI/Calendar/EventDateCard',
  component: EventDateCardStory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    date: {
      control: 'date',
      description: '선택된 날짜',
    },
    items: {
      control: 'object',
      description: '해당 날짜의 이벤트 목록',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    renderItem: {
      control: false,
      description: '각 아이템을 어떻게 렌더링할지 주입하는 함수',
    },
  },
  args: {
    date: new Date('2025-11-20T00:00:00'),
    items: [
      {
        id: '1',
        title: '후반기 만남의 장',
        type: 'official',
        mode: 'normal',
        startDate: new Date('2025-11-20T10:00:00'),
        endDate: new Date('2025-11-21T18:00:00'),
        place: '서울 강남구 어딘가',
      },
      {
        id: '2',
        title: '운영진 정기 회의',
        type: 'operation',
        mode: 'normal',
        startDate: new Date('2025-11-20T14:00:00'),
        endDate: new Date('2025-11-20T15:00:00'),
        place: '온라인 (Zoom)',
      },
    ] as EventItem[],
    isLoading: false,
    renderItem: (_ev: EventItem) => (
      <EventCard
        title={_ev.title}
        type={_ev.type}
        mode={_ev.mode || 'normal'}
        startDate={_ev.startDate}
        endDate={_ev.endDate}
        place={_ev.place}
      />
    ),
  },
} satisfies Meta<typeof EventDateCardStory>;

export default meta;

type Story = StoryObj<typeof EventDateCardStory>;

// ───────────────────────────────
// 기본 상태들
// ───────────────────────────────
export const Primary: Story = {};

// 로딩 상태
export const Loading: Story = {
  args: { isLoading: true },
};

// 빈 리스트
export const Empty: Story = {
  args: { items: [] },
};
