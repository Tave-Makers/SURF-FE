import type { Meta, StoryObj } from '@storybook/nextjs';
import { EventCard } from '../EventCard/EventCard';
import { EventDateCard } from './EventDateCard';
import type { ActivityCategory, EventCardType } from '../../model/types';

type EventItem = {
  id: string;
  title: string;
  category: ActivityCategory;
  mode: EventCardType;
  startDate?: Date | null;
  endDate?: Date | null;
  location?: string;
  isAdmin?: boolean;
  hasNotice?: boolean;
};

const meta: Meta<typeof EventDateCard<EventItem>> = {
  title: 'Entities/UI/Calendar/EventDateCard',
  component: EventDateCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
  argTypes: {
    date: { control: 'date' },
    isLoading: { control: 'boolean' },
    renderItem: { table: { disable: true } },
  },
  args: {
    date: new Date('2025-11-20T00:00:00'),
    isLoading: false,

    // 기본 renderItem 정의
    renderItem: (item) => (
      <EventCard
        title={item.title}
        category={item.category}
        mode={item.mode}
        startDate={item.startDate || null}
        endDate={item.endDate || null}
        location={item.location}
        isAdmin={item.isAdmin}
        hasNotice={item.hasNotice}
        onClickCard={() => console.log(`Clicked card: ${item.id}`)}
      />
    ),
    items: [
      {
        id: '1',
        title: '후반기 만남의 장',
        category: 'official',
        mode: 'calendar',
        startDate: new Date('2025-11-20T10:00:00'),
        endDate: new Date('2025-11-21T18:00:00'),
        location: '서울 강남구 어딘가',
        hasNotice: true,
      },
      {
        id: '2',
        title: '운영진 정기 회의',
        category: 'operation',
        mode: 'calendar',
        startDate: new Date('2025-11-20T14:00:00'),
        endDate: new Date('2025-11-20T15:00:00'),
        location: '온라인 (Zoom)',
        isAdmin: true,
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof EventDateCard<EventItem>>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    items: [],
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

// 목록 예시
export const MixedCases: Story = {
  args: {
    items: [
      {
        id: '1',
        title: '일반 회원 보기 (공지 있음)',
        category: 'official',
        mode: 'calendar',
        startDate: new Date(),
        endDate: new Date(),
        location: '장소 A',
        hasNotice: true,
        isAdmin: false,
      },
      {
        id: '2',
        title: '운영진 보기 (메뉴 버튼)',
        category: 'operation',
        mode: 'calendar',
        startDate: new Date(),
        endDate: new Date(),
        location: '장소 B',
        isAdmin: true,
      },
    ],
  },
};
